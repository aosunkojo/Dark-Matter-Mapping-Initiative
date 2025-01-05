;; quantum-computing-integration.clar

(define-map quantum-computers
  {id: uint}
  {
    name: (string-ascii 100),
    description: (string-ascii 1000),
    qubits: uint,
    status: (string-ascii 20)
  }
)

(define-map simulation-jobs
  {id: uint}
  {
    researcher: principal,
    computer-id: uint,
    description: (string-ascii 1000),
    status: (string-ascii 20),
    result: (optional (string-ascii 10000))
  }
)

(define-data-var next-computer-id uint u0)
(define-data-var next-job-id uint u0)

(define-public (register-quantum-computer (name (string-ascii 100)) (description (string-ascii 1000)) (qubits uint))
  (let
    (
      (computer-id (var-get next-computer-id))
    )
    (map-set quantum-computers
      {id: computer-id}
      {
        name: name,
        description: description,
        qubits: qubits,
        status: "online"
      }
    )
    (var-set next-computer-id (+ computer-id u1))
    (ok computer-id)
  )
)

(define-public (submit-simulation-job (computer-id uint) (description (string-ascii 1000)))
  (let
    (
      (job-id (var-get next-job-id))
    )
    (asserts! (is-some (map-get? quantum-computers {id: computer-id})) (err u404))
    (map-set simulation-jobs
      {id: job-id}
      {
        researcher: tx-sender,
        computer-id: computer-id,
        description: description,
        status: "pending",
        result: none
      }
    )
    (var-set next-job-id (+ job-id u1))
    (ok job-id)
  )
)

(define-public (update-simulation-status (job-id uint) (new-status (string-ascii 20)))
  (let
    (
      (job (unwrap! (map-get? simulation-jobs {id: job-id}) (err u404)))
    )
    (asserts! (is-eq tx-sender (get researcher job)) (err u403))
    (ok (map-set simulation-jobs
      {id: job-id}
      (merge job {status: new-status})
    ))
  )
)

(define-public (submit-simulation-result (job-id uint) (result (string-ascii 10000)))
  (let
    (
      (job (unwrap! (map-get? simulation-jobs {id: job-id}) (err u404)))
    )
    (asserts! (is-eq tx-sender (get researcher job)) (err u403))
    (ok (map-set simulation-jobs
      {id: job-id}
      (merge job {status: "completed", result: (some result)})
    ))
  )
)

(define-read-only (get-quantum-computer (id uint))
  (map-get? quantum-computers {id: id})
)

(define-read-only (get-simulation-job (id uint))
  (map-get? simulation-jobs {id: id})
)

