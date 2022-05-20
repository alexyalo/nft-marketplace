import { ethers } from 'ethers';
import { useContext, useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { AppContext } from '../context';
import { Item, ViewItem } from '../lib/Item';
import { useMarketplaceItems } from '../hooks/useMarketplaceItems';
import { useBuyMarketItem } from '../hooks/useBuyMarketItem';

export const Home = () => {
  const { items, loading } = useMarketplaceItems();
  const { buyMarketItem } = useBuyMarketItem();

  if (loading)
    return (
      <main className="p-2">
        <h2>Loading...</h2>
      </main>
    );
    
  return (
    <div className="d-flex justify-content-center">
      {
        items.length > 0 ?
          (
            <div className="px-5 container">
              <Row xs={1} md={2} lg={4} className="g-4 py-5">
                {items.map((item: ViewItem, idx: number) => (
                  <Col key={idx} className="overflow-hidden">
                    <Card>
                      <Card.Img variant="top" src={item.image} />
                      <Card.Body color="secondary">
                        <Card.Title>{item.name}</Card.Title>
                        <Card.Text>{item.description}</Card.Text>
                      </Card.Body>
                      <Card.Footer>
                        <div className="d-grid">
                          <Button onClick={() => buyMarketItem(item)} variant="primnary" size="lg">
                            Buy for {ethers.utils.formatEther(item.totalPrice)} ETH
                          </Button>
                        </div>
                      </Card.Footer>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          ) :
          (
            <main className="p-2">
              <h2>No listed assets</h2>
            </main>
          )
      }
    </div>
  );
}
