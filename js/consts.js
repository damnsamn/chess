// Coordinates
const A = 1;
const B = 2;
const C = 3;
const D = 4;
const E = 5;
const F = 6;
const G = 7;
const H = 8;

const Null = "";

// Global Constants
const w = 800;
const h = 800;
const boardSize = 600;
const marginX = (w - boardSize) / 2;
const marginY = (h - boardSize) / 2;
const squareSize = boardSize / 8;
const iconFontPath = 'assets/fa-solid-900.ttf';
const textFontPath = 'assets/RobotoMono-Bold.ttf';
const iconSize = squareSize / 1.5;

// Glyphs object
const glyphs = {
    pawn: "\u{F443}",
    rook: "\u{F447}",
    knight: "\u{F441}",
    bishop: "\u{F43A}",
    queen: "\u{F445}",
    king: "\u{F43F}",
}