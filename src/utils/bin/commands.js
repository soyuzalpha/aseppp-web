// List of commands that do not require API calls

import * as bin from './index';
import config from '@/config.json';

// Help
export const help = async () => {
  const commands = Object.keys(bin).sort().join(', ');
  var c = '';
  for (let i = 1; i <= Object.keys(bin).sort().length; i++) {
    if (i % 7 === 0) {
      c += Object.keys(bin).sort()[i - 1] + '\n';
    } else {
      c += Object.keys(bin).sort()[i - 1] + ' ';
    }
  }
  return `Welcome! Here are all the available commands:
\n${c}\n
[tab]: trigger completion.
[ctrl+l]/clear: clear terminal.\n
Type 'sumfetch' to display summary.
`;
};

// Redirection
export const repo = async () => {
  window.open(`${config.repo}`);
  return 'Opening Github repository...';
};

// About
export const about = async () => {
  return `Hi, I am ${config.name}. 
Welcome to my website!
More about me:
'sumfetch' - short summary.`;
};

export const resume = async () => {
  window.open(`${config.resume_url}`);
  return 'Opening resume...';
};

// Donate
// export const donate = async () => {
//   return `thank you for your interest.
// here are the ways you can support my work:
// - <u><a class="text-light-blue dark:text-dark-blue underline" href="${config.donate_urls.paypal}" target="_blank">paypal</a></u>
// - <u><a class="text-light-blue dark:text-dark-blue underline" href="${config.donate_urls.patreon}" target="_blank">patreon</a></u>
// `;
// };

// Contact
export const email = async () => {
  window.open(`mailto:${config.email}`);
  return `Opening mailto:${config.email}...`;
};

export const github = async () => {
  window.open(`https://github.com/${config.social.github}/`);

  return 'Opening github...';
};

export const linkedin = async () => {
  window.open(`https://www.linkedin.com/in/${config.social.linkedin}/`);

  return 'Opening linkedin...';
};

// Search
//

// export const duckduckgo = async () => {
//   window.open(`https://duckduckgo.com/?q=${args.join(' ')}`);
//   return `Searching duckduckgo for ${args.join(' ')}...`;
// };

// export const bing = async () => {
//   window.open(`https://bing.com/search?q=${args.join(' ')}`);
//   return `Wow, really? You are using bing for ${args.join(' ')}?`;
// };

// export const reddit = async () => {
//   window.open(`https://www.reddit.com/search/?q=${args.join(' ')}`);
//   return `Searching reddit for ${args.join(' ')}...`;
// };

// Typical linux commands
export const echo = async () => {
  return args.join(' ');
};

export const whoami = async () => {
  return `${config.ps1_username}`;
};

export const ls = async () => {
  return `a
bunch
of
fake
directories`;
};

export const cd = async () => {
  return `unfortunately, i cannot afford more directories.
if you want to help, you can type 'donate'.`;
};

export const date = async () => {
  return new Date().toString();
};

export const vi = async () => {
  return `woah, you still use 'vi'? just try 'vim'.`;
};

export const vim = async () => {
  return `'vim' is so outdated. how about 'nvim'?`;
};

export const nvim = async () => {
  return `'nvim'? too fancy. why not 'emacs'?`;
};

export const emacs = async () => {
  return `you know what? just use vscode.`;
};

export const sudo = async () => {
  window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank'); // ...I'm sorry
  return `Permission denied: with little power comes... no responsibility? `;
};

// Banner
export const banner = () => {
  return `



  █████╗ ███████╗███████╗██████╗                               
  ██╔══██╗██╔════╝██╔════╝██╔══██╗                              
  ███████║███████╗█████╗  ██████╔╝                              
  ██╔══██║╚════██║██╔══╝  ██╔═══╝                               
  ██║  ██║███████║███████╗██║                                   
  ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝              
  


Type 'help' to see the list of available commands.
Type 'sumfetch' to display summary.
`;
};