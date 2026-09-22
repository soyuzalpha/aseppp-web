#!/usr/bin/env bash
# End-to-end check of the admin flow against a running server.
set -uo pipefail
BASE=http://127.0.0.1:5101
JAR=$(mktemp)
PNG=$(mktemp --suffix=.png)
fail=0

# Touch the admin page first: it generates storage/admin.password on first run.
curl -s -m 20 -o /dev/null "$BASE/admin"
PASS=$(cat storage/admin.password)

check() { # label expected actual
  if [ "$2" = "$3" ]; then echo "ok   $1"; else echo "FAIL $1 (expected $2, got $3)"; fail=1; fi
}

code() { curl -s -m 20 -o /dev/null -w '%{http_code}' "$@"; }

# A 1x1 PNG.
printf '\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82' > "$PNG"

echo "── auth ──"
check "unauthenticated list is rejected" 401 "$(code $BASE/api/admin/posts)"
check "wrong password rejected" 401 "$(code -X POST -H 'Content-Type: application/json' -d '{"password":"nope"}' $BASE/api/admin/login)"
check "login accepted" 200 "$(code -c "$JAR" -X POST -H 'Content-Type: application/json' -d "{\"password\":\"$PASS\"}" $BASE/api/admin/login)"
check "authenticated list works" 200 "$(code -b "$JAR" $BASE/api/admin/posts)"

echo "── seeded reads ──"
check "seeded posts" 6 "$(curl -s -b "$JAR" $BASE/api/admin/posts | grep -o '"slug"' | wc -l | tr -d ' ')"
check "seeded projects" 7 "$(curl -s -b "$JAR" $BASE/api/admin/projects | grep -o '"slug"' | wc -l | tr -d ' ')"
check "seeded photos" 12 "$(curl -s -b "$JAR" $BASE/api/admin/photos | grep -o '"src"' | wc -l | tr -d ' ')"

echo "── create post ──"
NEW=$(curl -s -b "$JAR" -X POST -H 'Content-Type: application/json' $BASE/api/admin/posts -d '{
  "slug":"e2e-check","title":"E2E Check","date":"Sep 2026","read_time":3,
  "tags":["Test","E2E"],"excerpt":"created by the end-to-end check",
  "body":[{"type":"p","content":"hello"},{"type":"h2","content":"section"}],
  "featured":false,"sort":99}')
ID=$(printf '%s' "$NEW" | grep -o '"id":[0-9]*' | cut -d: -f2)
echo "     -> $NEW"
check "post created" "e2e-check" "$(curl -s -m 10 $BASE/posts | grep -o 'e2e-check' | head -1)"
check "post detail renders body" "hello" "$(curl -s -m 10 $BASE/posts/e2e-check | grep -o 'hello' | head -1)"

echo "── patch post ──"
check "patch ok" 200 "$(code -b "$JAR" -X PATCH -H 'Content-Type: application/json' -d "{\"id\":$ID,\"title\":\"E2E Check Renamed\"}" $BASE/api/admin/posts)"
check "patch visible" "E2E Check Renamed" "$(curl -s -m 10 $BASE/posts/e2e-check | grep -o 'E2E Check Renamed' | head -1)"

echo "── upload photo ──"
UP=$(curl -s -b "$JAR" -X POST -F "file=@$PNG" -F "cat=E2E" -F "alt=upload check" -F "w=1" -F "h=1" $BASE/api/admin/upload)
echo "     -> $UP"
SRC=$(printf '%s' "$UP" | sed -n 's/.*"src":"\([^"]*\)".*/\1/p')
PID=$(printf '%s' "$UP" | grep -o '"id":[0-9]*' | cut -d: -f2)
check "upload returns /media path" "1" "$(printf '%s' "$SRC" | grep -c '^/media/photos/E2E/')"
check "uploaded file is served" 200 "$(code $BASE$SRC)"
check "served as image/png" "image/png" "$(curl -s -m 10 -o /dev/null -w '%{content_type}' $BASE$SRC)"
check "photo appears on /pics" "1" "$(curl -s -m 10 $BASE/pics | grep -c "$SRC")"
check "new category is in the filter" "E2E" "$(curl -s -m 10 $BASE/pics | grep -o '>E2E<' | head -1 | tr -d '<>')"

echo "── upload guards ──"
check "bad category rejected" 400 "$(code -b "$JAR" -X POST -F "file=@$PNG" -F "cat=../evil" $BASE/api/admin/upload)"
check "bad extension rejected" 400 "$(code -b "$JAR" -X POST -F "file=@storage/admin.password" -F "cat=E2E" $BASE/api/admin/upload)"
check "unauth upload rejected" 401 "$(code -X POST -F "file=@$PNG" -F "cat=E2E" $BASE/api/admin/upload)"

echo "── media guards ──"
check "traversal not served" "not-200" "$(c=$(code --path-as-is "$BASE/media/../admin.password"); [ "$c" = 200 ] && echo 200 || echo not-200)"
check "nested traversal not served" "not-200" "$(c=$(code --path-as-is "$BASE/media/photos/../../admin.password"); [ "$c" = 200 ] && echo 200 || echo not-200)"
check "encoded traversal not served" "not-200" "$(c=$(code --path-as-is "$BASE/media/%2e%2e/admin.password"); [ "$c" = 200 ] && echo 200 || echo not-200)"
check "non-image blocked" 404 "$(code $BASE/media/admin.password)"

echo "── unknown table ──"
check "unknown table 404" 404 "$(code -b "$JAR" $BASE/api/admin/whatever)"

echo "── delete ──"
check "delete photo" 200 "$(code -b "$JAR" -X DELETE "$BASE/api/admin/photos?id=$PID")"
check "delete post" 200 "$(code -b "$JAR" -X DELETE "$BASE/api/admin/posts?id=$ID")"
check "post gone" 404 "$(code $BASE/posts/e2e-check)"
check "duplicate slug rejected" 400 "$(code -b "$JAR" -X POST -H 'Content-Type: application/json' -d '{"slug":"portfolio","title":"dupe"}' $BASE/api/admin/projects)"

echo "── logout ──"
check "logout" 200 "$(code -b "$JAR" -c "$JAR" -X DELETE $BASE/api/admin/login)"
check "session cleared" 401 "$(code -b "$JAR" $BASE/api/admin/posts)"

rm -f "$JAR" "$PNG"
[ "$fail" = 0 ] && echo "ALL PASS" || echo "FAILURES PRESENT"
exit $fail
