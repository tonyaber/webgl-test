precision mediump float;
void main() {
  // gl_FragColor - специальная переменная фрагментного шейдера.
  // Она отвечает за установку цвета.
  gl_FragColor = vec4(1, 0, 0.5, 1); // вернёт красновато-фиолетовый
}