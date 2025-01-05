;; governance.clar

(define-fungible-token governance-token)

(define-map proposals
  {id: uint}
  {
    proposer: principal,
    description: (string-ascii 1000),
    votes-for: uint,
    votes-against: uint,
    status: (string-ascii 20)
  }
)

(define-map votes
  {proposal-id: uint, voter: principal}
  {vote: bool}
)

(define-data-var next-proposal-id uint u0)

(define-public (create-proposal (description (string-ascii 1000)))
  (let
    (
      (proposal-id (var-get next-proposal-id))
    )
    (map-set proposals
      {id: proposal-id}
      {
        proposer: tx-sender,
        description: description,
        votes-for: u0,
        votes-against: u0,
        status: "active"
      }
    )
    (var-set next-proposal-id (+ proposal-id u1))
    (ok proposal-id)
  )
)

(define-public (vote (proposal-id uint) (vote-for bool))
  (let
    (
      (proposal (unwrap! (map-get? proposals {id: proposal-id}) (err u404)))
      (voter-balance (ft-get-balance governance-token tx-sender))
    )
    (asserts! (> voter-balance u0) (err u403))
    (asserts! (is-eq (get status proposal) "active") (err u403))
    (asserts! (is-none (map-get? votes {proposal-id: proposal-id, voter: tx-sender})) (err u403))

    (map-set votes {proposal-id: proposal-id, voter: tx-sender} {vote: vote-for})

    (if vote-for
      (map-set proposals {id: proposal-id}
        (merge proposal {votes-for: (+ (get votes-for proposal) voter-balance)}))
      (map-set proposals {id: proposal-id}
        (merge proposal {votes-against: (+ (get votes-against proposal) voter-balance)}))
    )
    (ok true)
  )
)

(define-public (close-proposal (proposal-id uint))
  (let
    (
      (proposal (unwrap! (map-get? proposals {id: proposal-id}) (err u404)))
    )
    (asserts! (is-eq (get status proposal) "active") (err u403))
    (ok (map-set proposals {id: proposal-id}
      (merge proposal {status: (if (> (get votes-for proposal) (get votes-against proposal)) "passed" "rejected")})))
  )
)

(define-read-only (get-proposal (id uint))
  (map-get? proposals {id: id})
)

(define-read-only (get-vote (proposal-id uint) (voter principal))
  (map-get? votes {proposal-id: proposal-id, voter: voter})
)

