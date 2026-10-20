export default interface SheetModalInterface {
  title: string
  formId: string
  inputId: string
  nameInput: string
  acceptFiles: string
  description: string
  /** Texte du sélecteur de fichiers (par défaut : PDF) */
  fileHint?: string
  /** Si renseigné : second champ qui ouvre directement l'appareil photo sur mobile */
  captureInputId?: string
}
