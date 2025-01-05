;; research-management.clar

(define-map proposals
  {id: uint}
  {
    researcher: principal,
    title: (string-ascii 100),
    description: (string-ascii 1000),
    funding-requested: uint,
    status: (string-ascii 20)
  }
)

(define-map funding-allocations
  {proposal-id: uint}
  {
    amount: uint,
    recipient: principal
  }
)

(define-data-var next-proposal-id uint u0)

(define-public (submit-proposal (title (string-ascii 100)) (description (string-ascii 1000)) (funding-requested uint))
  (let
    (
      (proposal-id (var-get next-proposal-id))
    )
    (map-set proposals
      {id: proposal-id}
      {
        researcher: tx-sender,
        title: title,
        description: description,
        funding-requested: funding-requested,
        status: "pending"
      }
    )
    (var-set next-proposal-id (+ proposal-id u1))
    (ok proposal-id)
  )
)

(define-public (update-proposal-status (proposal-id uint) (new-status (string-ascii 20)))
  (let
    (
      (proposal (unwrap! (map-get? proposals {id: proposal-id}) (err u404)))
    )
    (asserts! (is-eq tx-sender (get researcher proposal)) (err u403))
    (ok (map-set proposals
      {id: proposal-id}
      (merge proposal {status: new-status})
    ))
  )
)

(define-public (allocate-funding (proposal-id uint) (amount uint))
  (let
    (
      (proposal (unwrap! (map-get? proposals {id: proposal-id}) (err u404)))
    )
    (asserts! (is-eq (get status proposal) "approved") (err u403))
    (map-set funding-allocations
      {proposal-id: proposal-id}
      {
        amount: amount,
        recipient: (get researcher proposal)
      }
    )
    (ok true)
  )
)

(define-read-only (get-proposal (id uint))
  (map-get? proposals {id: id})
)

(define-read-only (get-funding-allocation (proposal-id uint))
  (map-get? funding-allocations {proposal-id: proposal-id})
)

