;; quantum-discovery-nft.clar

(define-non-fungible-token quantum-discovery uint)

(define-map discovery-data
  {id: uint}
  {
    discoverer: principal,
    name: (string-ascii 100),
    description: (string-ascii 1000),
    timestamp: uint
  }
)

(define-data-var next-discovery-id uint u0)

(define-public (mint-discovery (name (string-ascii 100)) (description (string-ascii 1000)))
  (let
    (
      (discovery-id (var-get next-discovery-id))
    )
    (try! (nft-mint? quantum-discovery discovery-id tx-sender))
    (map-set discovery-data
      {id: discovery-id}
      {
        discoverer: tx-sender,
        name: name,
        description: description,
        timestamp: block-height
      }
    )
    (var-set next-discovery-id (+ discovery-id u1))
    (ok discovery-id)
  )
)

(define-public (transfer-discovery (id uint) (recipient principal))
  (nft-transfer? quantum-discovery id tx-sender recipient)
)

(define-read-only (get-discovery-data (id uint))
  (map-get? discovery-data {id: id})
)

