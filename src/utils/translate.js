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

var lang = 'fr';
var region = 'CA';
var translations = {
  '[Insert default English text here]': {
    fr: {
      default: '[Insérer texte français par défaut ici]',
      FR: '[Insérer texte français de France ici]',
      CA: '[Insérer texte français canadien ici]',
    },
  },
}

global._ = (s) => {
  if (!translations[s]) {
    translations[s] = {};
    return s;
  }

  if (!translations[s][lang])
    return s;
  
  if (translations[s][lang][region])
    return translations[s][lang][region];
  
  if (translations[s][lang].default)
    return translations[s][lang].default;

  return s;
}

global.setLang = (l, r) => {
  lang = l;
  region = r;
}
