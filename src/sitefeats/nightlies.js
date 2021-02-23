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

function get_categories(cb) {
  fs.readdir('./public/nightlies', (err, cats) => {
    if (err)
      throw err;

    cb(cats);
  });
}

function get_categories_html(cb) {
  get_categories((cats) => {
    var html = '';

    for (var c of cats) {
      html += '<li><a href="/nightlies/' + c + '">' + c.replace(/_/g, " ") + '</a></li>';
    }

    cb('<ul class="horiz-list">' + html + '</ul>');
  });
}

function get_file_info(file, cb) {
  return new Promise(function(resolve, reject) {
    fs.stat(file, (err, stats) => {
      if (err)
        reject(err);

      var fd = fs.createReadStream(file);
      var hash = crypto.createHash('sha256');
      hash.setEncoding('hex');

      fd.on('end', function() {
        hash.end();
        resolve({
          hash: hash.read(),
          date: stats.mtime,
          size: Math.floor(stats.size / 10485.76) / 100,
        });
      });

      fd.pipe(hash);
    });
  });
}

function bind(app) {
  app.get('/nightlies/:subdir/?', (req, res) => {
    get_categories_html((topbar) => {
      fs.readdir('./public/nightlies/' + req.params.subdir, async (err, artifacts) => {
        
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
            for (var n of artifacts) {
              var info = await get_file_info(__dirname + '/../../public/nightlies/' + req.params.subdir + "/" + n);
              nightlies += '<tr>' +
              '<td><a href="/nightlies/' + htmlescape(req.params.subdir + "/" + n) + '"/>' + n + '</a></td>' + 
              '<td>' + info.date.toUTCString() + '</td>' + 
              '<td>' + info.size + ' MB</td>' +
              '<td>' + info.hash + '</td>' + 
                '</tr>';
            }
            nightlies = '<table><tr>' +
            '<th>Download</th>' + 
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

    if (!req.files || !req.files.artifact || !req.body.key || !req.body.subdir) {
      res.status(400).send(JSON.stringify({
        error: true,
        message: 'Missing body params',
      }));
      return;
    }

    if (crypto.createHash('sha512').update(req.body.key).digest('hex') != config.key) {
      res.status(401).send(JSON.stringify({
        error: true,
        message: 'Invalid key',
      }));
      return;
    }

    fs.mkdir(__dirname + '/../../public/nightlies/' + req.body.subdir + '/', { recursive: true }, (err) => {
      if (err)
        throw err;

      req.files.artifact.mv(__dirname + '/../../public/nightlies/' + req.body.subdir + '/' + req.files.artifact.name, (err2) => {
        if (err2)
          throw err2;

        res.status(200).send(JSON.stringify({
          error: false,
          message: 'File uploaded',
        }));

        var data = '{"content":"Nightly ready for ' + req.body.subdir.replace(/"/g, "\\\"").replace(/_/g, " ") + ': https://supertux.semphris.com/nightlies/' + req.body.subdir.replace(/"/g, "\\\"") + '/' + req.files.artifact.name + '"}';

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
