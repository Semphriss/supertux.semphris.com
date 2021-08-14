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

function bind(app) {
  app.post('/upload_crash', (req, res) => {
    if (!req.files || !req.files.logs) {
      res.status(400).send({ error: true, message: "No logs uploaded" });
      return;
    }
    var ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim();
    ip = ip.replace(/[^0-9\\.]/g, '');
    var now = new Date();
    var date = now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate() + "_" + now.getHours() + "-" + now.getMinutes() + "-" + now.getSeconds();
    req.files.logs.mv(__dirname + "/../../uploaded_logs/" + date + "_" + ip + ".log");
    res.status(200).send({ error: false });
  });
}

module.exports = {
  bind: bind,
}
