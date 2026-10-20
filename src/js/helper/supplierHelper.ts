import type SupplierInterface from '../../intefaces/Supplier/SupplierInterface'

/**
 * Fournisseur créé avec son seul nom (saisie rapide ou import Qonto) : l'adresse reste à renseigner.
 */
export const isSupplierToComplete = (
  supplier: Pick<SupplierInterface, 'address'>,
): boolean => !supplier.address?.trim()
