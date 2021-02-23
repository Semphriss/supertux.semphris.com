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

const fs = require('fs');

global.parse = (path, vars, cb) => {
  fs.readFile('./components/' + path, 'utf-8', function(err, content) {
    if (err) {
      cb(err, null);
      return;
    }

    for (v in vars) {
      var regex = new RegExp('\\{\\{ *' + v + ' *\\}\\}', 'gi');
      content = content.replace(regex, vars[v]);
    }

    cb(null, content);
  });
}

