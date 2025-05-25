import type Framework7 from 'framework7'
import type { ClientFormInteface } from '../../intefaces/Client/ClientFormInteface'
import type { ClientInterface } from '../../intefaces/Client/ClientInterface'
import type PageFormClientInteface from '../../intefaces/Client/PageFormClientInteface'
import { findClientById, updateClient } from './client'

export type ClientPageUpdate = {
  $on: CallableFunction
  $f7: Framework7
  clientId: number
}

export default async function initFormClientUpdate({
  $on,
  $f7,
  clientId,
}: ClientPageUpdate): Promise<PageFormClientInteface> {
  const client: ClientInterface = await findClientById(clientId, $f7)

  const formClient: ClientFormInteface = {
    firstname: client.firstname,
    lastname: client.lastname,
    city: client.city,
    phoneNumber: client.phoneNumber.replace(/\./g, ''),
    postalCode: client.postalCode,
    streetAddress: client.streetAddress,
    email: client.email,
  }

  const send = (): void => {
    const formData = $f7.form.convertToData('#form-client')
    updateClient(formData, clientId, $f7)
  }

  $on('pageBeforeIn', () => {
    $f7.form.fillFromData('#form-client', formClient)
  })

  return {
    send,
    titlePage: 'Modification client',
    blockTitle: 'Modification informations',
  }
}
