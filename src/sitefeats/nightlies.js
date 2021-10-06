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

const crypto = require("crypto");
const fs = require("fs");
const https = require('https');
const recursive = require("recursive-readdir");

function get_categories(cb) {
  fs.readdir('./public/nightlies', (err, cats) => {
    if (err)
      throw err;

    cb(cats);
  });
}

function get_categories_html(curr, cb) {
  get_categories((cats) => {
    var html = '';

    for (var c of cats) {
      html += '<li><a href="/nightlies/' + c + '"' + (curr == c ? ' class="highlight"' : '') + '>' + c.replace(/_/g, " ") + '</a></li>';
    }

    cb('<ul class="horizontal-list">' + html + '</ul>');
  });
}

var hash_cache = {};

function get_file_info(file) {
  return new Promise(function(resolve, reject) {
    fs.stat(file, (err, stats) => {
      if (err)
        reject(err);

      if (!hash_cache[file]) {
        var fd = fs.createReadStream(file);
        var hash = crypto.createHash('sha256');
        hash.setEncoding('hex');

        fd.on('end', function() {
          hash.end();
          hash_cache[file] = hash.read();
          resolve({
            hash: hash_cache[file],
            date: stats.mtime,
            size: Math.floor(stats.size / 10485.76) / 100,
          });
        });

        fd.pipe(hash);
      } else {
        resolve({
          hash: hash_cache[file],
          date: stats.mtime,
          size: Math.floor(stats.size / 10485.76) / 100,
        });
      }
    });
  });
}

function bind(app) {
  app.get('/nightlies/:subdir/?', (req, res) => {
    get_categories_html(req.params.subdir, (topbar) => {
      recursive(__dirname + '/../../public/nightlies/' + req.params.subdir, async (err, artifacts) => {
        
        if (err) {
          parse('nightlies/index.html', {
            CONTENT: topbar + '<p>No category <code>' + htmlescape(req.params.subdir) + '</code> exists. <a href="/nightlies">See all categories</a></p>',
          }, (err2, content) => {
            if (err2)
              throw err2;

            parse('layout.html', {
              TITLE: htmlescape(_('SuperTux nightlies download')),
              CONTENT: content,
            }, (err3, content2) => {
              if (err3)
                throw err3;

              res.send(content2);

            });

          });
        } else {

          var nightlies = '';
          if (artifacts.length > 0) {
            var arts = [];

            for (var n of artifacts) {
              arts.push({
                name: n.substr(n.lastIndexOf('/') + 1),
                // The hell below actually means "the name of the folder the file is in"
                branch: n.substr(n.substr(0, n.lastIndexOf('/')).lastIndexOf('/') + 1, n.lastIndexOf('/') - n.substr(0, n.lastIndexOf('/')).lastIndexOf('/') - 1),
                ...await get_file_info(n)
              });
            }

            // Reverse date order
            arts.sort((a, b) => b.date - a.date);

            for (var a of arts) {
              nightlies += '<tr>' +
              '<td><a href="/nightlies/' + htmlescape(req.params.subdir + "/" + a.branch + '/' + a.name) + '"/>' + a.name + '</a></td>' + 
              '<td>' + a.branch + '</td>' + 
              '<td>' + a.date.toUTCString() + '</td>' + 
              '<td>' + a.size + ' MB</td>' +
              '<td style="word-break: break-all;">' + a.hash + '</td>' + 
                '</tr>';
            }

            nightlies = '<table><tr>' +
            '<th>Download</th>' + 
            '<th>Branch</th>' + 
            '<th>Date</th>' + 
            '<th>Size</th>' + 
            '<th>SHA-256 Hash</th>' + 
            '</tr>' + nightlies + '</table>';
          } else {
            nightlies = '<p>No nightly available for <code>' + htmlescape(req.params.subdir) + '</code>.</p>';
          }

          parse('nightlies/index.html', {
            CONTENT: topbar + nightlies,
          }, (err2, content) => {
            if (err2)
              throw err2;

            parse('layout.html', {
              TITLE: htmlescape(_('SuperTux nightlies download')),
              CONTENT: content,
            }, (err3, content2) => {
              if (err3)
                throw err3;

              res.send(content2);

            });

          });

        }

      });
    });
  });

  app.get('/nightlies/?', (req, res) => {

    fs.readdir('./public/nightlies', (err, dirs) => {
      if (err)
        throw err;

      if (dirs.length > 0) {
        res.redirect('/nightlies/' + dirs[0]);
      } else {

        parse('nightlies/index.html', {
          CONTENT: '<p>No nightlies available for now.</p>',
        }, (err, content) => {
          if (err) console.log(err);

          parse('layout.html', {
            TITLE: htmlescape(_('SuperTux nightlies download')),
            CONTENT: content,
          }, (err2, content2) => {
            if (err2) console.log(err);

            res.send(content2);

          });

        });

      }
    });

  });

  app.post('/api/nightlies/?', (req, res) => {

    if (!req.files || !req.files.artifact || !req.body.key || !req.body.subdir || !req.body.branch) {
      res.status(400).send(JSON.stringify({
        error: true,
        message: 'Missing body params',
      }));
      return;
    }

    req.body.subdir = req.body.subdir.replace(/\//g, "_");
    req.body.branch = req.body.branch.replace(/\//g, ".");

    if (crypto.createHash('sha512').update(req.body.key).digest('hex') != config.key) {
      res.status(401).send(JSON.stringify({
        error: true,
        message: 'Invalid key',
      }));
      return;
    }

    fs.mkdir(__dirname + '/../../public/nightlies/' + req.body.subdir + '/' + req.body.branch, { recursive: true }, (err) => {
      if (err)
        throw err;

      req.files.artifact.mv(__dirname + '/../../public/nightlies/' + req.body.subdir + '/' + req.body.branch + "/" + req.files.artifact.name, (err2) => {
        if (err2)
          throw err2;

        res.status(200).send(JSON.stringify({
          error: false,
          message: 'File uploaded',
        }));

        var data = '{"content":"Nightly ready for branch `' + req.body.branch.replace(/[^a-zA-Z0-9\-_]/g, ".") + '` for ' + req.body.subdir.replace(/"/g, "\\\"").replace(/_/g, " ") + ': https://supertux.semphris.com/nightlies/' + req.body.subdir.replace(/"/g, "\\\"") + '/' + req.body.branch.replace(/"/g, "\\\"") + '/' + req.files.artifact.name.replace(/"/g, "\\\"") + '"}';

        var discordReq = https.request({
          hostname: "discord.com",
          port: 443,
          path: config.discordPath,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
          },
        });

        discordReq.write(data);
        discordReq.end();
      });
    });


  });
}

module.exports = {
  bind: bind,
}
