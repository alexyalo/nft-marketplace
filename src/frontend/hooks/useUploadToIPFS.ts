import { create as ipfsHttpClient } from 'ipfs-http-client';

const client = ipfsHttpClient({ url: 'https://ipfs.infura.io:5001/api/v0' });

export const useUploadToIPFS = (cb: (url: string) => void) => {
  const uploadToIPFS = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (!event.currentTarget.files) return;

    const file = event.currentTarget.files[0];
    if (typeof file !== 'undefined') {
      try {
        const result = await client.add(file);
        console.log('result', result);
        cb(`https://ipfs.infura.io/ipfs/${result.path}`);
      } catch (err) {
        console.log('ipfs image upload error', err);
      }
    }
  }
  return {
    uploadToIPFS
  }
}