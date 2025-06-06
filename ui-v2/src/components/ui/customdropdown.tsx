import { useEffect, useState } from "react";
import type { Token } from "../../lib/types";
import { useAuth } from "../../lib/auth-provider";

const CustomDropDown = ({
    items,
    onSelect,
}: {
    items: Token[];
    onSelect: (val: Token) => void;
}) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<Token>(items[0]);
    const { rates } = useAuth()

    useEffect(() => {
        onSelect(selected)
    }, [selected])

    const handleSelect = (item: Token) => {
        setSelected(item);
        onSelect(item);
        setOpen(false);
    };

    return (
        <div className="relative w-full">
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex h-10 w-full justify-between rounded-md border border-gray-800 bg-gray-900 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 crypto-input text-white"
            >
                <div className="flex text-left items-center justify-center gap-4">
                    <img width="24" src={selected?.image} alt={selected?.name} />
                    <span>{selected?.symbol} ({selected?.name})</span>
                </div>
                <span className="ml-2">▾</span>
            </button>

            {open && (
                <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-700 bg-gray-900 shadow-lg text-white">
                    {items?.length > 0 && items.map((item) => (
                        <div
                            key={item?.symbol}
                            onClick={() => handleSelect(item)}
                            className="px-3 py-2 text-sm text-white hover:bg-gray-800 cursor-pointer flex justify-between"
                        >
                            <div className="flex items-center justify-center gap-4 text-center">
                                <img width="34" src={item?.image} alt={item?.name} />
                                <span>{item?.symbol} ({item?.name})</span>
                            </div>
                            <span>≈ {
                                (
                                    Number(item?.actual_balance ?? 0) *
                                    Number(
                                        rates?.[
                                            item?.symbol === 'sBTC'
                                                ? 'btc'
                                                : item?.symbol?.toLowerCase() ?? 'stx'
                                        ]?.current_price ?? 0
                                    )
                                ).toFixed(2)
                            }
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomDropDown;