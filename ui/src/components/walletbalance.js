import { Avatar, Button } from '@nextui-org/react';
import React from 'react';
import { IoMdSend } from 'react-icons/io';

function WalletBalance({ stx, btc, setSelectedContract, sendModalOnOpen }) {
    console.log({ stx });
    return (
        <div className="myflex">
            <div className="flex gap-1 justify-center items-center">
                <div className='flex gap-1 justify-center items-center'>
                    <Avatar
                        isBordered
                        radius="full"
                        size="md"
                        src="/stx-logo.svg"
                    />
                    <div className="flex flex-col gap-1 items-start justify-center">
                        <h4 className="text-small font-semibold leading-none text-default-600">Balance: <code className='text-warning'>{stx.balance}</code></h4>
                        <h5 className="text-small tracking-tight text-default-400">Rate: $ {stx.rate}</h5>
                    </div>
                </div>
                <Button color="primary" radius="full" size="sm" onPress={() => sendModalOnOpen(true)}>
                    <IoMdSend />
                </Button>
            </div>
            <div className="flex gap-1 justify-center items-center">
                <div className='flex gap-1 justify-center items-center'>
                    <Avatar
                        isBordered
                        radius="full"
                        size="md"
                        src="/btc-logo.svg"
                    />
                    <div className="flex flex-col gap-1 items-start justify-center">
                        <h4 className="text-small font-semibold leading-none text-default-600">Balance: <code className='text-warning'>{ }</code></h4>
                        <h5 className="text-small tracking-tight text-default-400">Rate: $ { }</h5>
                    </div>
                </div>
                {/* <Button color="primary" radius="full" size="sm" onPress={() => sendModalOnOpen(true)}>
                    <IoMdSend />
                </Button> */}
            </div>
        </div>
    );
}

export default WalletBalance;