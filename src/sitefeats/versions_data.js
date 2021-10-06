// supertux.semphris.com - Dynamic website for SuperTux
// Copyright (C) 2021 A. Semphris <semphris@protonmail.com>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

const versions = {
  "linux-amd64": {
    "Releases": {
      "v0.6.2": "https://github.com/SuperTux/supertux/releases/download/v0.6.2/SuperTux_2-v0.6.2.glibc2.27-x86_64.AppImage",
      "v0.6.1": "https://github.com/SuperTux/supertux/releases/download/v0.6.1.1/SuperTux_2-v0.6.1.1.glibc2.27-x86_64.AppImage",
      "v0.6.0": "https://github.com/SuperTux/supertux/releases/download/v0.6.0/SuperTux_2-v0.6.0.glibc2.14-x86_64.AppImage"
    },
  },
  "osx-amd64": {
    "Releases": {
      "v0.6.2": "https://github.com/SuperTux/supertux/releases/download/v0.6.2/SuperTux-v0.6.2-Darwin.dmg",
      "v0.6.1": "https://github.com/SuperTux/supertux/releases/download/v0.6.1.1/SuperTux-v0.6.1.1-Darwin.dmg",
      "v0.6.0": "https://github.com/SuperTux/supertux/releases/download/v0.6.0/SuperTux-v0.6.0-Darwin.dmg",
      "v0.5.1": "https://github.com/SuperTux/supertux/releases/download/v0.5.1/SuperTux-v0.5.1-win32.msi",
      "v0.5.0": "https://github.com/SuperTux/supertux/releases/download/v0.5.0/SuperTux-v0.5.0-Darwin.dmg",
      "v0.4.0": "https://github.com/SuperTux/supertux/releases/download/v0.4.0/SuperTux-0.4.0-Darwin.dmg",
      "v0.3.5": "https://github.com/SuperTux/supertux/releases/download/v0.3.5a/SuperTux-0.3.5a-osx-intel.dmg",
      "v0.3.4": "https://github.com/SuperTux/supertux/releases/download/v0.3.4/SuperTux-0.3.4-osx-intel.dmg",
      "v0.1.3": "https://github.com/SuperTux/supertux/releases/download/v0.1.3/supertux-0.1.3-macosx-universal.dmg",
    },
  },
  "windows-amd64": {
    "Releases": {
      "v0.6.2": "https://github.com/SuperTux/supertux/releases/download/v0.6.2/SuperTux-v0.6.2-win64.msi",
      "v0.6.1": "https://github.com/SuperTux/supertux/releases/download/v0.6.1.1/SuperTux-v0.6.1.1-win64.msi",
      "v0.6.0": "https://github.com/SuperTux/supertux/releases/download/v0.6.0/SuperTux-v0.6.0-win64.msi",
      "v0.5.1": "https://github.com/SuperTux/supertux/releases/download/v0.5.1/SuperTux-v0.5.1-win64.msi",
      "v0.5.0": "https://github.com/SuperTux/supertux/releases/download/v0.5.0/SuperTux-v0.5.0-win64.msi",
      "v0.4.0": "https://github.com/SuperTux/supertux/releases/download/v0.4.0/SuperTux-0.4.0-win64.msi",
      "v0.3.5": "https://github.com/SuperTux/supertux/releases/download/v0.3.5a/supertux-0.3.5a-win64-setup.exe",
      "v0.3.4": "https://github.com/SuperTux/supertux/releases/download/v0.3.4/supertux-0.3.4-win32.exe",
      "v0.3.3": "https://github.com/SuperTux/supertux/releases/download/v0.3.3/supertux-0.3.3b-win32.exe",
      "v0.1.3": "https://github.com/SuperTux/supertux/releases/download/v0.1.3/supertux-0.1.3-setup.exe",
    },
  },
  "windows-i386": {
    "Releases": {
      "v0.6.2": "https://github.com/SuperTux/supertux/releases/download/v0.6.2/SuperTux-v0.6.2-win32.msi",
      "v0.6.1": "https://github.com/SuperTux/supertux/releases/download/v0.6.1.1/SuperTux-v0.6.1.1-win32.msi",
      "v0.6.0": "https://github.com/SuperTux/supertux/releases/download/v0.6.0/SuperTux-v0.6.0-win32.msi",
      "v0.5.1": "https://github.com/SuperTux/supertux/releases/download/v0.5.1/SuperTux-v0.5.1-win32.msi",
      "v0.5.0": "https://github.com/SuperTux/supertux/releases/download/v0.5.0/SuperTux-v0.5.0-win32.msi",
      "v0.4.0": "https://github.com/SuperTux/supertux/releases/download/v0.4.0/SuperTux-0.4.0-win32.msi",
      "v0.3.5": "https://github.com/SuperTux/supertux/releases/download/v0.3.5a/supertux-0.3.5a-win32-setup.exe",
      "v0.3.4": "https://github.com/SuperTux/supertux/releases/download/v0.3.4/supertux-0.3.4-win32.exe",
      "v0.3.3": "https://github.com/SuperTux/supertux/releases/download/v0.3.3/supertux-0.3.3b-win32.exe",
      "v0.1.3": "https://github.com/SuperTux/supertux/releases/download/v0.1.3/supertux-0.1.3-setup.exe",
    },
  },
};

function bind(app) {
  app.get('/versions/:os', (req, res) => {
    const os = req.params.os;

    if (!os || typeof os !== "string"){
      res.status(400).send("Error: Must put OS type (linux-amd64, windows-i386, osx-arm64, etc.)");
      return;
    }

    if (!versions[os]) {
      res.status(400).send("Error: Unknown OS");
      return;
    }

    var ret = "";
    for (var key in versions[os]) {
      if (versions[os].hasOwnProperty(key)) {
        ret += "# " + key + "\n";
        for (var v in versions[os][key]) {
          if (versions[os][key].hasOwnProperty(v)) {
            ret += v + ": " + versions[os][key][v] + "\n";
          }
        }
      }
    }

    res.status(200).set({"Content-Type": "text/plain"}).send(ret);
  });
}

module.exports = {
  bind: bind,
}
