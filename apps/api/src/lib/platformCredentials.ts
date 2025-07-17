import { PrismaClient } from '../../generated/prisma';
import { CryptoService } from './crypto';

const prisma = new PrismaClient();

export interface PlatformCredentialData {
  ringba?: {
    accountId: string;
    apiToken: string;
  };
  digitalocean?: {
    spacesKey: string;
    spacesSecret: string;
    region: string;
    bucket: string;
    endpoint: string;
  };
  runpod?: {
    apiKey: string;
    podId: string;
  };
  redis?: {
    url: string;
  };
}

export class PlatformCredentialsService {
  static async getCredentials(userId: string, platform: string): Promise<PlatformCredentialData | null> {
    try {
      const record = await prisma.platformCredentials.findUnique({
        where: {
          user_id_platform: {
            user_id: userId,
            platform: platform
          }
        }
      });

      if (!record || !record.is_active) {
        return null;
      }

      const decryptedCredentials = CryptoService.decryptCredentials(record.credentials as string);
      return decryptedCredentials;
    } catch (error) {
      console.error('Error fetching platform credentials:', error);
      return null;
    }
  }

  static async saveCredentials(
    userId: string, 
    platform: string, 
    credentials: PlatformCredentialData
  ): Promise<boolean> {
    try {
      const encryptedCredentials = CryptoService.encryptCredentials(credentials);

      await prisma.platformCredentials.upsert({
        where: {
          user_id_platform: {
            user_id: userId,
            platform: platform
          }
        },
        update: {
          credentials: encryptedCredentials,
          is_active: true,
          updated_at: new Date()
        },
        create: {
          user_id: userId,
          platform: platform,
          credentials: encryptedCredentials,
          is_active: true
        }
      });

      return true;
    } catch (error) {
      console.error('Error saving platform credentials:', error);
      return false;
    }
  }

  static async deleteCredentials(userId: string, platform: string): Promise<boolean> {
    try {
      await prisma.platformCredentials.updateMany({
        where: {
          user_id: userId,
          platform: platform
        },
        data: {
          is_active: false,
          updated_at: new Date()
        }
      });

      return true;
    } catch (error) {
      console.error('Error deleting platform credentials:', error);
      return false;
    }
  }

  static async listUserPlatforms(userId: string): Promise<string[]> {
    try {
      const records = await prisma.platformCredentials.findMany({
        where: {
          user_id: userId,
          is_active: true
        },
        select: {
          platform: true
        }
      });

      return records.map(record => record.platform);
    } catch (error) {
      console.error('Error listing user platforms:', error);
      return [];
    }
  }

  static async validateCredentials(platform: string, credentials: PlatformCredentialData): Promise<boolean> {
    switch (platform) {
      case 'ringba':
        return !!(credentials.ringba?.accountId && credentials.ringba?.apiToken);
      case 'digitalocean':
        return !!(credentials.digitalocean?.spacesKey && credentials.digitalocean?.spacesSecret);
      case 'runpod':
        return !!(credentials.runpod?.apiKey && credentials.runpod?.podId);
      case 'redis':
        return !!(credentials.redis?.url);
      default:
        return false;
    }
  }
}
