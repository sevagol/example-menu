import React, { useState } from 'react';
import "./OrdersList.css";
import Milk from './assets/MILK-2.svg';
import { Button, Menu, MenuItem } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { styled } from '@mui/system';
import './font.css'

const StyledToggleButton = styled(ToggleButton)({
    color: 'black',
    '&.Mui-selected': {
        backgroundColor: 'black',
        color: 'white',
        border: '2px solid black',
        borderRadius: '4px',
    },
    '&.MuiToggleButton-root:active': {
        backgroundColor: 'white',
        color: 'black',
        border: '2px solid black',
        borderRadius: '4px',
    },
    '&.MuiToggleButton-root:hover': {
        backgroundColor: 'black',
        color: 'white',
        border: '2px solid black',
        borderRadius: '4px',
    },
});

type Order = {
    id: string;
    title: string;
    count: number;
    price: number;
    options?: string[];
    selectedOption?: string
};

interface OrdersListProps {
    orders: Order[];
    alignment: 'toGo' | 'here';
    setAlignment: React.Dispatch<React.SetStateAction<'toGo' | 'here'>>;
    setOrders: React.Dispatch<React.SetStateAction<Order[]>>; // добавьте это
}


const OrdersList: React.FC<OrdersListProps> = ({ orders, alignment, setAlignment, setOrders }) => {
    const handleAlignment = (_: any, newValue: 'toGo' | 'here') => {
        setAlignment(newValue);
    };

    const total = orders.reduce((acc, order) => acc + (order.count * order.price), 0);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleSelectOption = (option: string) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order.id === selectedId ? { ...order, selectedOption: option } : order
            )
        );
        handleClose();
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
        setAnchorEl(event.currentTarget);
        setSelectedId(id);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedId(null);
    };

    return (
        <div className="orders-container">
            <h2>Your Orders:</h2>
            <ul>
                {orders.flatMap((order) =>
                    Array.from({ length: order.count }, (_, countIndex) => (
                        <li key={`${order.id}-${countIndex}`}>
                            {order.title} - ₪{order.price.toFixed(2)}
                            {order.options && (
                                <>
                                    <Button className='svg-button' onClick={(e) => handleClick(e, order.id)}>
                                        <img src={Milk} alt="Options" />
                                    </Button>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={selectedId === order.id && Boolean(anchorEl)}
                                        onClose={handleClose}
                                    >
                                        {order.options.map((option, idx) => (
                                            <MenuItem key={idx} onClick={() => handleSelectOption(option)}>
                                                {option}
                                            </MenuItem>

                                        ))}
                                    </Menu>
                                </>
                            )}
                        </li>
                    ))
                )}
            </ul>
            <div className="total-price">Total: ₪{total.toFixed(2)}</div>
            <div className="toggle-container">
                <ToggleButtonGroup
                    value={alignment}
                    exclusive
                    onChange={handleAlignment}
                    aria-label="text alignment"
                    color="primary"
                >
                    <StyledToggleButton value="toGo" aria-label="left aligned">
                        to go
                    </StyledToggleButton>
                    <StyledToggleButton value="here" aria-label="centered">
                        here
                    </StyledToggleButton>
                </ToggleButtonGroup>
            </div>
        </div>
    );
};

export default OrdersList;
