import crypto from 'crypto';

export class CryptoService {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly KEY_LENGTH = 32;
  private static readonly IV_LENGTH = 16;
  private static readonly TAG_LENGTH = 16;

  private static getKey(): Buffer {
    const key = process.env.ENCRYPTION_KEY;
    if (!key) {
      throw new Error('ENCRYPTION_KEY environment variable is required');
    }
    
    if (key.length !== this.KEY_LENGTH * 2) { // Hex string should be 64 chars
      throw new Error(`ENCRYPTION_KEY must be ${this.KEY_LENGTH} bytes (64 hex characters)`);
    }
    
    return Buffer.from(key, 'hex');
  }

  static encryptCredentials(credentials: any): string {
    try {
      const key = this.getKey();
      const iv = crypto.randomBytes(this.IV_LENGTH);
      const cipher = crypto.createCipher(this.ALGORITHM, key);
      cipher.setAAD(iv);
      
      const plaintext = JSON.stringify(credentials);
      let encrypted = cipher.update(plaintext, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const tag = cipher.getAuthTag();
      
      // Combine IV + tag + encrypted data
      const combined = Buffer.concat([
        iv,
        tag,
        Buffer.from(encrypted, 'hex')
      ]);
      
      return combined.toString('base64');
    } catch (error) {
      throw new Error(`Encryption failed: ${error}`);
    }
  }

  static decryptCredentials(encryptedData: string): any {
    try {
      const key = this.getKey();
      const combined = Buffer.from(encryptedData, 'base64');
      
      // Extract IV, tag, and encrypted data
      const iv = combined.slice(0, this.IV_LENGTH);
      const tag = combined.slice(this.IV_LENGTH, this.IV_LENGTH + this.TAG_LENGTH);
      const encrypted = combined.slice(this.IV_LENGTH + this.TAG_LENGTH);
      
      const decipher = crypto.createDecipher(this.ALGORITHM, key);
      decipher.setAuthTag(tag);
      decipher.setAAD(iv);
      
      let decrypted = decipher.update(encrypted, null, 'utf8');
      decrypted += decipher.final('utf8');
      
      return JSON.parse(decrypted);
    } catch (error) {
      throw new Error(`Decryption failed: ${error}`);
    }
  }

  static generateKey(): string {
    return crypto.randomBytes(this.KEY_LENGTH).toString('hex');
  }
}
