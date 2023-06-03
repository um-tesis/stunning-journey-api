import { CreateProjectInput } from '../dto/create-project.input';
import { UpdateProjectInput } from '../dto/update-project.input';
import { BadRequestException } from '@nestjs/common';
import { encrypt } from '../../../helpers/crypto.helper';
import config from 'src/api/config';

const { NODE_ENV } = config;

type MercadopagoConfig = {
  instantCheckout: boolean;
  publicKey: string;
  accessToken: string;
};
export const setMercadoPagoConfig = async (projectInput: CreateProjectInput | UpdateProjectInput) => {
  const mercadoPagoConfig: MercadopagoConfig = {
    ...(projectInput.mpAccessToken && { accessToken: projectInput.mpAccessToken }),
    ...(projectInput.mpPublicKey && { publicKey: projectInput.mpPublicKey }),
    ...(projectInput.mpInstantCheckout && { instantCheckout: projectInput.mpInstantCheckout }),
  };

  if (Object.keys(mercadoPagoConfig).length) {
    if (!mercadoPagoConfig.instantCheckout || !mercadoPagoConfig.publicKey || !mercadoPagoConfig.accessToken) {
      throw new BadRequestException('Mercadopago configuration is incomplete.');
    }

    if (!validKey(mercadoPagoConfig.publicKey) || !validKey(mercadoPagoConfig.accessToken)) {
      throw new BadRequestException('Invalid Mercadopago tokens.');
    }

    projectInput.mpAccessToken = await encrypt(mercadoPagoConfig.accessToken);

    return true;
  }

  return false;
};

const validKey = (key: string) => key.startsWith(NODE_ENV === 'production' ? 'APP_USR-' : 'TEST-');
