import { ethers } from 'ethers';
import { Card, Col, Row } from 'react-bootstrap';
import { useMyListedItems } from '../hooks/useMyListedItems';
import { ViewItem } from '../lib/Item';

export const MyListedItems = () => {
  const {
    loading,
    items,
    soldItems
  } = useMyListedItems();

  if (loading)
    return (
      <main className="py-2">
        <h2>Loading...</h2>
      </main>
    )
  return (
    <div className="d-flex justify-content-center">
      {
        items.length > 0 ?
          (<div className="px-5 py-3 container">
            <h2>Listed</h2>
            <Row xs={1} md={2} lg={4} className="g-4 py-3">
              {
                items.map((item, idx) => (
                  <Col key={idx} className="overflow-hidden">
                    <Card>
                      <Card.Img variant="top" src={item.image} />
                      <Card.Footer>{ethers.utils.formatEther(item.totalPrice)} ETH</Card.Footer>
                    </Card>
                  </Col>
                ))
              }
            </Row>
            {soldItems.length > 0 ? <SoldItems items={soldItems} /> : <></>}
          </div>
          ) :
          (
            <main className="py-2">
              <h2>No listed assets</h2>
            </main>
          )
      }
    </div>
  )
}

const SoldItems = ({ items }: {items: ViewItem[]}) => {
  return (
    <>
      <h2>Sold</h2>
      <Row xs={1} md={2} lg={4} className="g-4 py-3">
        {items.map((item, idx) => (
          <Col key={idx} className="overflow-hidden">
            <Card>
              <Card.Img variant="top" src={item.image} />
              <Card.Footer>For {ethers.utils.formatEther(item.totalPrice)} ETH - Received {ethers.utils.formatEther(item.price!)} ETH</Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

    </>
  )
}