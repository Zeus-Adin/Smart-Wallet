;; title: csw-registry
;; version: v1
;; summary: Registry for clarity smart wallets

(use-trait commission-trait 'SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335.commission-trait.commission)
(impl-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)

(define-trait csw-trait (
  (get-owner
    ()
    (response principal uint)
  )
))

;; token definition
(define-non-fungible-token csw-ownership uint)

;; Only authorized caller to flip the switch and update URI
(define-constant DEPLOYER tx-sender)

;; Var to store the token URI, allowing for metadata association with the NFT
(define-data-var token-uri (string-ascii 256) "ipfs://QmUQY1aZ799SPRaNBFqeCvvmZ4fTQfZvWHauRvHAukyQDB")

(define-public (update-token-uri (new-token-uri (string-ascii 256)))
  (ok (begin
    (asserts! (is-eq contract-caller DEPLOYER) ERR-NOT-AUTHORIZED)
    (var-set token-uri new-token-uri)
  ))
)

(define-data-var contract-uri (string-ascii 256) "ipfs://QmWKTZEMQNWngp23i7bgPzkineYC9LDvcxYkwNyVQVoH8y")

(define-public (update-contract-uri (new-contract-uri (string-ascii 256)))
  (ok (begin
    (asserts! (is-eq contract-caller DEPLOYER) ERR-NOT-AUTHORIZED)
    (var-set token-uri new-contract-uri)
  ))
)

;; errors
(define-constant ERR-UNWRAP (err u101))
(define-constant ERR-NOT-AUTHORIZED (err u102))
(define-constant ERR-NOT-LISTED (err u103))
(define-constant ERR-WRONG-COMMISSION (err u104))
(define-constant ERR-LISTED (err u105))
(define-constant ERR-NO-CSW (err u106))
(define-constant ERR-HASH-MALFORMED (err u107))
(define-constant ERR-STX-BURNT-INSUFFICIENT (err u108))
(define-constant ERR-PREORDER-NOT-FOUND (err u109))
(define-constant ERR-CHARSET-INVALID (err u110))
(define-constant ERR-NAMESPACE-ALREADY-EXISTS (err u111))
(define-constant ERR-PREORDER-CLAIMABILITY-EXPIRED (err u112))
(define-constant ERR-NAMESPACE-NOT-FOUND (err u113))
(define-constant ERR-OPERATION-UNAUTHORIZED (err u114))
(define-constant ERR-NAMESPACE-ALREADY-LAUNCHED (err u115))
(define-constant ERR-NAMESPACE-PREORDER-LAUNCHABILITY-EXPIRED (err u116))
(define-constant ERR-NAMESPACE-NOT-LAUNCHED (err u117))
(define-constant ERR-CSW-NOT-AVAILABLE (err u118))
(define-constant ERR-NAMESPACE-BLANK (err u119))
(define-constant ERR-NAME-BLANK (err u120))
(define-constant ERR-NAME-PREORDERED-BEFORE-NAMESPACE-LAUNCH (err u121))
(define-constant ERR-NAMESPACE-HAS-MANAGER (err u122))
(define-constant ERR-OVERFLOW (err u123))
(define-constant ERR-NO-CSWSPACE-MANAGER (err u124))
(define-constant ERR-FAST-MINTED-BEFORE (err u125))
(define-constant ERR-PREORDERED-BEFORE (err u126))
(define-constant ERR-NAME-NOT-CLAIMABLE-YET (err u127))
(define-constant ERR-IMPORTED-BEFORE (err u128))
(define-constant ERR-LIFETIME-EQUAL-0 (err u129))
(define-constant ERR-MIGRATION-IN-PROGRESS (err u130))
(define-constant ERR-NO-PRIMARY-NAME (err u131))

;; Counter to keep track of the last minted NFT ID, ensuring unique identifiers
(define-data-var csw-index uint u0)

;; maps
;; Map to track market listings, associating NFT IDs with price and commission details
(define-map market
  uint
  {
    price: uint,
    commission: principal,
  }
)

;; Define a map to link NFT IDs to their respective smart wallet.
(define-map index-to-csw
  uint
  principal
)

;; Define a map to link smart wallet to their respective NFT IDs.
(define-map csw-to-index
  principal
  uint
)

;; It maps a user's principal to the ID of their primary name.
(define-map primary-csw
  principal
  uint
)

;; read-only
(define-read-only (get-last-token-id)
  (ok (var-get csw-index))
)

;; @desc SIP-09 compliant function to get token URI
(define-read-only (get-token-uri (id uint))
  ;; Returns a predefined set URI for the token metadata
  (ok (some (var-get token-uri)))
)

(define-read-only (get-contract-uri)
  ;; Returns a predefined set URI for the contract metadata
  (ok (some (var-get contract-uri)))
)

;; @desc SIP-09 compliant function to get the owner of a specific token by its ID
(define-read-only (get-owner (id uint))
  ;; Check and return the owner of the specified NFT
  (ok (nft-get-owner? csw-ownership id))
)

;; @desc get owner function
(define-read-only (get-owner-name (clarity-smart-wallet <csw-trait>))
  ;; Check and return the owner of the specified NFT
  (ok (nft-get-owner? csw-ownership
    (unwrap! (get-id-from-csw clarity-smart-wallet) ERR-NO-CSW)
  ))
)

;; Defines a read-only function to fetch the unique ID of a BNS name given its name and the namespace it belongs to.
(define-read-only (get-id-from-csw (clarity-smart-wallet <csw-trait>))
  ;; Attempts to retrieve the ID from the 'csw-to-index' map using the provided name and namespace as the key.
  (map-get? csw-to-index (contract-of clarity-smart-wallet))
)

;; Defines a read-only function to fetch the BNS name and the namespace given a unique ID.
(define-read-only (get-csw-from-id (id uint))
  ;; Attempts to retrieve the name and namespace from the 'index-to-csw' map using the provided id as the key.
  (map-get? index-to-csw id)
)

;; Fetcher for primary csw
(define-read-only (get-primary-csw (owner principal))
  (map-get? primary-csw owner)
)

;; Fetcher for primary csw returns clarity smart wallet
(define-read-only (get-primary (owner principal))
  (ok (get-csw-from-id (unwrap! (map-get? primary-csw owner) ERR-NO-PRIMARY-NAME)))
)

;; public functions
;; @param id: ID of the NFT being transferred.
;; @param owner: Principal of the current owner of the NFT.
;; @param recipient: Principal of the recipient of the NFT.
(define-public (transfer
    (id uint)
    (owner principal)
    (recipient principal)
  )
  (let (
      ;; Get the csw of the NFT.
      (csw (unwrap! (get-csw-from-id id) ERR-NO-CSW))
      (nft-current-owner (unwrap! (nft-get-owner? csw-ownership id) ERR-NO-CSW))
    )
    ;; Check owner and recipient is not the same
    (asserts! (not (is-eq nft-current-owner recipient))
      ERR-OPERATION-UNAUTHORIZED
    )
    ;; Check contract-caller
    (asserts! (is-eq contract-caller nft-current-owner) ERR-NOT-AUTHORIZED)
    ;; Check if in fact the owner is-eq to nft-current-owner
    (asserts! (is-eq owner nft-current-owner) ERR-NOT-AUTHORIZED)
    ;; Ensures the NFT is not currently listed in the market.
    (asserts! (is-none (map-get? market id)) ERR-LISTED)
    ;; Update primary csw if needed for owner
    (update-primary-csw-owner id owner)
    ;; Update primary csw if needed for recipient
    (update-primary-csw-recipient id recipient)
    ;; Execute the NFT transfer.
    (try! (nft-transfer? csw-ownership id nft-current-owner recipient))
    (print {
      topic: "transfer-csw",
      owner: recipient,
      csw: csw,
      id: id,
    })
    (ok true)
  )
)

;; @desc Function to list an NFT for sale.
;; @param id: ID of the NFT being listed.
;; @param price: Listing price.
;; @param comm-trait: Address of the commission-trait.
(define-public (list-in-ustx
    (id uint)
    (price uint)
    (comm-trait <commission-trait>)
  )
  (let (
      ;; Get the csw of the NFT.
      (csw (unwrap! (map-get? index-to-csw id) ERR-NO-CSW))
      ;; Creates a listing record with price and commission details
      (listing {
        price: price,
        commission: (contract-of comm-trait),
      })
    )
    ;; assert that the owner is the contract-caller
    (asserts! (is-eq (some contract-caller) (nft-get-owner? csw-ownership id))
      ERR-NOT-AUTHORIZED
    )
    ;; Updates the market map with the new listing details
    (map-set market id listing)
    ;; Prints listing details
    (ok (print (merge listing {
      a: "list-in-ustx",
      id: id,
    })))
  )
)

;; @desc Function to remove an NFT listing from the market.
;; @param id: ID of the NFT being unlisted.
(define-public (unlist-in-ustx (id uint))
  (let (
      ;; Get the csw of the NFT.
      (csw (unwrap! (map-get? index-to-csw id) ERR-NO-CSW))
      ;; Verify if the NFT is listed in the market.
      (market-map (unwrap! (map-get? market id) ERR-NOT-LISTED))
    )
    ;; assert that the owner is the contract-caller
    (asserts! (is-eq (some contract-caller) (nft-get-owner? csw-ownership id))
      ERR-NOT-AUTHORIZED
    )
    ;; Deletes the listing from the market map
    (map-delete market id)
    ;; Prints unlisting details
    (ok (print {
      a: "unlist-in-ustx",
      id: id,
    }))
  )
)

;; @desc Function to buy an NFT listed for sale, transferring ownership and handling commission.
;; @param id: ID of the NFT being purchased.
;; @param comm-trait: Address of the commission-trait.
(define-public (buy-in-ustx
    (id uint)
    (comm-trait <commission-trait>)
  )
  (let (
      ;; Retrieves current owner and listing details
      (owner (unwrap! (nft-get-owner? csw-ownership id) ERR-NO-CSW))
      (listing (unwrap! (map-get? market id) ERR-NOT-LISTED))
      (price (get price listing))
    )
    ;; Verifies the commission details match the listing
    (asserts! (is-eq (contract-of comm-trait) (get commission listing))
      ERR-WRONG-COMMISSION
    )
    ;; Transfers STX from buyer to seller
    (try! (stx-transfer? price contract-caller owner))
    ;; Handle commission payment
    (try! (contract-call? comm-trait pay id price))
    ;; Transfers the NFT to the buyer
    ;; This function differs from the `transfer` method by not checking who the contract-caller is, otherwise transfers would never be executed
    (try! (purchase-transfer id owner contract-caller))
    ;; Removes the listing from the market map
    (map-delete market id)
    ;; Prints purchase details
    (print {
      a: "buy-in-ustx",
      id: id,
    })
    (ok true)
  )
)

;; @desc Sets the primary csw for the caller to a specific csw they own.
;; @param primary-csw-id: ID of the csw to be set as primary.
(define-public (set-primary-csw (primary-csw-id uint))
  (begin
    ;; Verify the contract-caller is the owner of the csw.
    (asserts!
      (is-eq (unwrap! (nft-get-owner? csw-ownership primary-csw-id) ERR-NO-CSW)
        contract-caller
      )
      ERR-NOT-AUTHORIZED
    )
    ;; Update the contract-caller's primary csw.
    (map-set primary-csw contract-caller primary-csw-id)
    ;; Return true upon successful execution.
    (ok true)
  )
)

;; @desc registration function: (csw-register)
;; @param: clarity-smart-wallet (csw-trait): the clarity smart wallet to be registered.
(define-public (csw-register (clarity-smart-wallet <csw-trait>))
  (let (
      ;; Calculates the ID for the new csw to be minted.
      (id-to-be-minted (+ (var-get csw-index) u1))
      (csw (contract-of clarity-smart-wallet))
      (csw-id (map-get? csw-to-index csw))
      (owner (unwrap! (contract-call? clarity-smart-wallet get-owner) ERR-UNWRAP))
    )
    ;; Ensure the csw is not already registered.
    (asserts! (is-none csw-id) ERR-CSW-NOT-AVAILABLE)
    (asserts! (is-eq owner contract-caller) ERR-NOT-AUTHORIZED)
    ;; Update the index
    (var-set csw-index id-to-be-minted)
    (map-set csw-to-index csw id-to-be-minted)
    (map-set index-to-csw id-to-be-minted csw)
    ;; Update primary csw if needed for owner
    (update-primary-csw-recipient id-to-be-minted owner)
    ;; Mints the new csw NFT.
    (try! (nft-mint? csw-ownership id-to-be-minted owner))
    ;; Log the new csw registration
    (print {
      topic: "new-csw",
      owner: owner,
      csw: csw,
      id: id-to-be-minted,
    })
    ;; Signals successful completion.
    (ok id-to-be-minted)
  )
)

;; This function is similar to the 'transfer' function but does not check that the owner is the contract-caller.
;; @param id: the id of the nft being transferred.
;; @param owner: the principal of the current owner of the nft being transferred.
;; @param recipient: the principal of the recipient to whom the nft is being transferred.
(define-private (purchase-transfer
    (id uint)
    (owner principal)
    (recipient principal)
  )
  (let (
      ;; Attempts to retrieve the name and namespace associated with the given NFT ID.
      (csw (unwrap! (map-get? index-to-csw id) ERR-NO-CSW))
    )
    ;; Update primary name if needed for owner
    (update-primary-csw-owner id owner)
    ;; Update primary name if needed for recipient
    (update-primary-csw-recipient id recipient)
    ;; Executes the NFT transfer from the current owner to the recipient.
    (try! (nft-transfer? csw-ownership id owner recipient))
    (print {
      topic: "transfer-csw",
      owner: recipient,
      csw: csw,
      id: id,
    })
    (ok true)
  )
)

;; Private function to update the primary name of an address when transfering a name
;; If the id is = to the primary name then it means that a transfer is happening and we should delete it
(define-private (update-primary-csw-owner
    (id uint)
    (owner principal)
  )
  ;; Check if the owner is transferring the primary name
  (if (is-eq (map-get? primary-csw owner) (some id))
    ;; If it is, then delete the primary name map
    (map-delete primary-csw owner)
    ;; If it is not, do nothing, keep the current primary name
    false
  )
)

;; Private function to update the primary name of an address when recieving
(define-private (update-primary-csw-recipient
    (id uint)
    (recipient principal)
  )
  ;; Check if recipient has a primary name
  (match (map-get? primary-csw recipient)
    recipient-primary-csw
    ;; If recipient has a primary name do nothing
    true
    ;; If recipient doesn't have a primary name
    (map-set primary-csw recipient id)
  )
)
