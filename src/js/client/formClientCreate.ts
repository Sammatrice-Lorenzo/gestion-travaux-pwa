import type Framework7 from 'framework7'
import type PageFormClientInteface from '../../intefaces/Client/PageFormClientInteface.js'
import { createClient } from './client.js'

export default async function initFormClientCreate({
  $f7,
}: { $f7: Framework7 }): Promise<PageFormClientInteface> {
  const send = () => {
    const formData = $f7.form.convertToData('#form-client')
    createClient(formData, $f7)
  }

  return {
    send,
    titlePage: 'Nouveau client',
    blockTitle: "Création d'un client",
  }
}
