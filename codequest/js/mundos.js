/* Registro de mundos. Cada mundo ensina UM assunto e tem suas próprias áreas (salas).
   js/mundos/<id>/mundo.js chama FC.registrarMundo(...); as salas apontam para o mundo com o campo "mundo". */
window.FC = window.FC || {};
FC.MUNDOS = [];
FC.registrarMundo = function (m) { FC.MUNDOS.push(m); };
FC.mundo = function (id) { return FC.MUNDOS.find(m => m.id === id); };
FC.salasDoMundo = function (id) { return FC.SALAS.filter(s => s.mundo === id); };
