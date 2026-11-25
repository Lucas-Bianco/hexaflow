// three.js GLTFLoader rewrites node names before exposing them:
//   spaces -> "_",  "." and "/" stripped.
// e.g. "Nanolab Shell-1" -> "Nanolab_Shell-1", "m3_short.step-17" -> "m3_shortstep-17".
// So glMatch strings with spaces/"/" will NOT match a raw node name. Apply the
// same rewrite to both sides before substring-matching, or parts won't be
// clickable. (This gotcha cost real debugging on the v1 site.)
export const norm = (s) => String(s).replace(/\s+/g, '_').replace(/[./]+/g, '')

export const matches = (nodeName, glMatch) =>
  Array.isArray(glMatch) && glMatch.some((m) => norm(nodeName).includes(norm(m)))