(define-constant err-invalid-payload (err u5000))

(define-public (stx-transfer-sponsored (details {amount: uint, to: principal, fees: uint}))
    (contract-call? .smart-wallet-standard extension-call .ext-sponsored-transfer (unwrap! (to-consensus-buff? details) err-invalid-payload)))