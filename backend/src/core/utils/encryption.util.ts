import crypto from 'crypto';

export class EncryptionService {
  private algorithm = 'aes-256-gcm';
  private key: Buffer;
  private iv: Buffer;

  constructor(encryptionKey: string) {
    this.key = crypto.scryptSync(encryptionKey, 'salt', 32);
    this.iv = crypto.randomBytes(16);
  }

  encrypt(text: string): { encryptedData: string; iv: string; authTag: string } {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return {
      encryptedData: encrypted,
      iv: this.iv.toString('hex'),
      authTag: (cipher as any).getAuthTag().toString('hex')
    };
  }

  decrypt(encryptedData: string, iv: string, authTag: string): string {
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, Buffer.from(iv, 'hex'));

    (decipher as any).setAuthTag(Buffer.from(authTag, 'hex'));

    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  static generateEncryptionKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}
