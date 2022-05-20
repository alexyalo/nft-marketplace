import { ethers } from 'ethers';
import { Card, Col, Row } from 'react-bootstrap';
import { useMyPurchases } from '../hooks/useMyPurchases';

export const MyPurchases = () => {
  const { loading, purchases } = useMyPurchases();

  if (loading)
    return (
      <main className="py-2">
        <h2>Loading...</h2>
      </main>
    )
  return (
    <div className="d-flex justify-content-center">
      {
        purchases.length > 0 ?
          (<div className="px-5 py-3 container">
            <Row xs={1} md={2} lg={4} className="g-4 py-3">
              {
                purchases.map((item, idx) => (
                  <Col key={idx} className="overflow-hidden">
                    <Card>
                      <Card.Img variant="top" src={item.image} />
                      <Card.Footer>{ethers.utils.formatEther(item.totalPrice)} ETH</Card.Footer>
                    </Card>
                  </Col>
                ))
              }
            </Row>
          </div>
          ) :
          (
            <main className="py-2">
              <h2>No purchases</h2>
            </main>
          )
      }
    </div>
  )
}
