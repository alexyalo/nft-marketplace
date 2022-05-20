import { Button, Form, Row } from 'react-bootstrap';
import { useCreateNFT } from '../hooks/useCreateNFT';
import { useState } from 'react';
import { useUploadToIPFS } from '../hooks/useUploadToIPFS';

export const Create = () => {
  const [image, setImage] = useState('')
  const [price, setPrice] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const { createNFT } = useCreateNFT();
  const { uploadToIPFS } = useUploadToIPFS((url) => setImage(url));

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control
                type="file"
                required
                name="file"
                onChange={uploadToIPFS}
              />
              <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
              <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />
              <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in ETH" />
              <div className="d-grid px-0">
                <Button onClick={() => createNFT({ name, price, image, description })} variant="primary" size="lg">
                  Create & List NFT!
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );

}