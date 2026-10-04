import { ICompany, IVendor } from '@invoicely/api-interfaces';
import { GstSupplyType, IndianState } from '@invoicely/constants';
import { getStateFromGstIn } from './indian-state';

export interface GstSupply {
  type: GstSupplyType;
  isDetermined: boolean;
  companyState: IndianState | null;
  vendorState: IndianState | null;
}

export const getGstSupply = (
  company: ICompany | null,
  vendor: IVendor | null
): GstSupply => {
  const companyState =
    getStateFromGstIn(company?.gstIn) ??
    company?.headOfficeSplitAddress?.state ??
    null;
  const vendorState =
    getStateFromGstIn(vendor?.gstIn) ?? vendor?.address?.state ?? null;
  const isDetermined = !!companyState && !!vendorState;

  return {
    type:
      isDetermined && companyState !== vendorState
        ? GstSupplyType.INTER_STATE
        : GstSupplyType.INTRA_STATE,
    isDetermined,
    companyState,
    vendorState,
  };
};
