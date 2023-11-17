import { FC, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Grid, IconButton, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import WebApp from '@twa-dev/sdk';
import './font.css';

interface ItemProps {
    title: string;
    price: number;
    imgUrl: string;
    onAddChange: (title: string, isAdded: boolean, count: number) => void; // Обновлено для передачи количества
    orders: { title: string, count: number }[]; // Новое свойство
}


const MenuItem: FC<ItemProps> = ({ orders, title, price, imgUrl, onAddChange }) => {
    const currentOrder = orders.find(order => order.title === title);
    const initialCount = currentOrder ? currentOrder.count : 0;

    const [count, setCount] = useState(initialCount);
    const [isAdding, setIsAdding] = useState(initialCount > 0);


    const handleAddClick = () => {
        setIsAdding(true);
        setCount(1);
        onAddChange(title, true, 1);
        WebApp.HapticFeedback.impactOccurred( 'medium' );
    };

    const handleIncrease = () => {
        WebApp.HapticFeedback.impactOccurred( 'light' );
        setCount(prevCount => prevCount + 1);
        onAddChange(title, true, 1); // Только добавляем 1
    };
    
    const handleDecrease = () => {
        WebApp.HapticFeedback.impactOccurred( 'light' );
        setCount((prevCount) => {
            const newCount = prevCount - 1;
            if (newCount <= 0) {
                setIsAdding(false); // Если количество равно 0, меняем isAdding на false
            }
            onAddChange(title, false, 1); // Обновляем количество в заказе
            return newCount;
        });
    };
    
    
    


    return (
        <Card sx={{
            position: 'relative',
            width: '100%',       // Установите ширину на 100% контейнера
            height: 300,         // Установите фиксированную высоту для всех карточек, например, 400px
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'transparent',
            boxShadow: 'none',
            overflow: 'visible'
        }}>

            {count > 0 && (
                <Box sx={{ position: 'absolute', top: 0, right: 0, mt: 1, mr: 1 }}>
                    <Typography variant="h6" color="black">{count}</Typography>
                </Box>
            )}
            <CardMedia
                component="img"
                sx={{
                    width: '100%', // Задайте ширину на 100% контейнера
                    height: 200,   // Установите фиксированную высоту, например, 200px
                    objectFit: 'contain', // Указывает, как содержимое должно масштабироваться внутри контейнера
                    borderRadius: '4px',
                    fontSize: '1rem',
                }}
                image={imgUrl}
                alt={title}
            />

            <CardContent sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: 'transparent',
                boxShadow: 'none',
                p: 1,
                mt: -1,
            }}>
                <Typography gutterBottom variant="h6" component="div" sx={{ color: 'black', fontSize: '1rem', fontFamily:'Poppins' }}>
                    {title}
                </Typography>
                <Typography variant="body2" color="black" sx={{ color: 'black', fontSize: '0.8rem', fontFamily:'Poppins' }}>
                    ₪{price.toFixed(2)}
                </Typography>
                {!isAdding ? (
                    <Button variant="contained" onClick={handleAddClick} sx={{
                        mt: 2,
                        backgroundColor: 'white',
                        color: 'black',
                        border: '2px solid black', // Добавляем черную рамку
                        '&:hover': {
                          backgroundColor: 'white',
                          borderColor: 'black', // Цвет рамки при наведении
                        },
                      }}>Add</Button>
                ) : (
                    <Grid container spacing={1} alignItems="center" justifyContent="center" sx={{ mt: 2 }}>
                        <Grid item>
                            <IconButton size="small" onClick={handleDecrease}
                                sx={{
                                    backgroundColor: 'white',
                                    color: 'black',
                                    border: '2px solid black',
                                    borderRadius: '4px',
                                }}>
                                <RemoveIcon style={{ color: 'black' }} />
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <IconButton size="small" onClick={handleIncrease}
                                 sx={{
                                    backgroundColor: 'white',
                                    color: 'black',
                                    border: '2px solid black',
                                    borderRadius: '4px',
                        
                                }}>
                                <AddIcon style={{ color: 'black' }} />
                            </IconButton>
                        </Grid>
                    </Grid>

                )}
            </CardContent>
        </Card>
    );
};

export default MenuItem;
