import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import MenuItem from './MenuItem';
import OrdersList from './OrdersList';
// import Cappucino from './assets/CAPPUCCINO.svg';
// import Cortado from './assets/CORTADO-2.svg';
// import Espresso from './assets/ESPRESSO-2.svg';
// import FlatWhite from './assets/FLAT WHITE.svg';
// import Latte from './assets/LATTE-2.svg';
// import filter from './assets/FILTER-2.svg';
// import Juice from './assets/orange juice-2.svg';
// import Matcha from './assets/MATCHA-2.svg';
// import V60 from './assets/V 60.svg';
// import Bumble from './assets/bumble-2.svg';
// import Etonic from './assets/espresso tonic-2.svg';
// import Ilatte from './assets/ice latte-2.svg';
// import Imatcha from './assets/ice matcha latte-2.svg';
// import Lemonade from './assets/lemonade-2.svg';
// import Mtonic from './assets/matcha tonic-2.svg';
// import VC from './assets/vitamin c-2.svg'
import './App.css';
import WebApp from '@twa-dev/sdk';
import { Grid } from '@mui/material';
import { useCallback } from 'react';
import { getFirestore } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";





// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgIIof3E7rTJ_MysoXHHGTESLtD9vavCw",
  authDomain: "menu-89271.firebaseapp.com",
  projectId: "menu-89271",
//   databaseURL: "https://menu-89271.firebaseio.com",
  storageBucket: "menu-89271.appspot.com",
  messagingSenderId: "55850687910",
  appId: "1:55850687910:web:5c6305c2269e95d6510367"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);


const MainButtonLogic: React.FC<{
    addedItemsCount: number,
    orders: { id: string, title: string; count: number; price: number; selectedOption?: string }[],
    alignment: 'toGo' | 'here'
  }> = ({ addedItemsCount, orders, alignment }) => {    const location = useLocation();
    const navigate = useNavigate();


    const TELEGRAM_TOKEN = "6958756705:AAFTQYV28jtGBu-Qa0ZkFf_6M1ZNGoX3EOg";
    const CHANNEL_ID = "-1002008195730";

    const sendOrderToTelegram = (orders: { id: string; title: string; count: number; price: number; selectedOption?: string }[]) => {
        const orderInfo = orders.map(order => {
          let orderText = `${order.title} - ${order.count}x at ${(order.price * order.count).toFixed(2)}`;
          if (order.selectedOption) {
            orderText += ` (Option: ${order.selectedOption})`;
          }
          return orderText;
        }).join('\n'); // Каждый заказ отображается отдельной строкой
        
        const finalMessage = `Order Type: ${alignment === "toGo" ? "To Go" : "Here"}\n\n${orderInfo}`;
        
        const baseURL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
        const messageText = `New Order:\n\n${finalMessage}`;
      
        fetch(baseURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: CHANNEL_ID,
                text: messageText
            })
        });
      }
      

    const handleBackClick = useCallback(() => {
        navigate("/"); // Вместо window.history.back()
    }, [navigate]);

    const handleMainButtonClick = useCallback(() => {
        // Если мы на главной странице
        if (location.pathname === "/") {
            navigate("/orders");
        }
        // Если мы на странице заказов
        else if (location.pathname === "/orders") {
            WebApp.showConfirm("Do you want to place an order?", (confirmed) => {
                if (confirmed) {
                    sendOrderToTelegram(orders);
                    alert("Your order has been placed!");
                    WebApp.close();

                }})
            
        }
    }, [navigate, location.pathname, orders]);


    // useEffect для обработки нажатия кнопки "назад"
    useEffect(() => {
        const backbutton = WebApp.BackButton;

        if (location.pathname === "/orders") {
            backbutton.show();
            backbutton.onClick(handleBackClick);
        } else {
            backbutton.hide();
        }

        // Отключаем обработчик при размонтировании
        return () => backbutton.offClick(handleBackClick);

    }, [location.pathname, handleBackClick]);

    // Отдельный useEffect для логики MainButton
    useEffect(() => {
        const mainbutton = WebApp.MainButton;

        mainbutton.setParams({
            color: location.pathname === "/" ? '#000000' : '#000000'
        });

        // Показываем кнопку "VIEW ORDER" если есть добавленные товары, иначе скрываем ее
        if (location.pathname === "/" && addedItemsCount > 0) {
            mainbutton.setText("VIEW ORDER");
            mainbutton.show();
        } else if (location.pathname === "/orders") {
            mainbutton.setText("ORDER NOW");
            mainbutton.show();
        } else {
            mainbutton.hide();
        }

        mainbutton.onClick(handleMainButtonClick);

        // Отключаем обработчик при размонтировании
        return () => mainbutton.offClick(handleMainButtonClick);

    }, [location.pathname, addedItemsCount, handleMainButtonClick]);

    return null;
};
const App = () => {
    const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);

interface MenuItemType {
  title: string;
  price: number;
  imgUrl: string;
  options?: string[];
}

    const [addedItemsCount, setAddedItemsCount] = useState(0);
    const [orders, setOrders] = useState<{ id: string, title: string; count: number; price: number; options?: string[], selectedOption?: string }[]>([]);
    const [alignment, setAlignment] = useState<'toGo' | 'here'>('here');
   
    useEffect(() => {
        const fetchMenuItems = async () => {
          const productsCollection = collection(firestore, "products");
          const querySnapshot = await getDocs(productsCollection);
          const productsData: MenuItemType[] = []; // Явно указываем тип Product[]
          querySnapshot.forEach((doc) => {
            productsData.push(doc.data() as MenuItemType); // Приводим данные к типу Product
          });
          setMenuItems(productsData);
        };
      
        fetchMenuItems();
      }, []);
    


    // const menuItems = [
    //     { title: 'Cappucino', price: 14, imgUrl: Cappucino, options: ['Soy', 'Almond', 'Oat', 'Regular'] },
    //     { title: 'Cortado', price: 14, imgUrl: Cortado, options: ['Soy', 'Almond', 'Oat', 'Regular'] },
    //     { title: 'Espresso', price: 12, imgUrl: Espresso },
    //     { title: 'Flat White', price: 15, imgUrl: FlatWhite, options: ['Soy', 'Almond', 'Oat', 'Regular'] },
    //     { title: 'Latte', price: 16, imgUrl: Latte, options: ['Soy', 'Almond', 'Oat', 'Regular'] },
    //     { title: 'Filter', price: 15, imgUrl: filter },
    //     { title: 'Juice', price: 20, imgUrl: Juice },
    //     { title: 'Matcha', price: 18, imgUrl: Matcha },
    //     { title: 'V60', price: 20, imgUrl: V60 },
    //     { title: 'Bumble', price: 20, imgUrl: Bumble },
    //     { title: 'Esp. tonic', price: 18, imgUrl: Etonic },
    //     { title: 'Iced latte', price: 18, imgUrl: Ilatte },
    //     { title: 'Ice M latte', price: 18, imgUrl: Imatcha },
    //     { title: 'Lemonade', price: 18, imgUrl: Lemonade },
    //     { title: 'M tonic', price: 18, imgUrl: Mtonic },
    //     { title: 'Vitamin C', price: 22, imgUrl: VC },
    // ];

    const handleAddChange = (title: string, isAdded: boolean, count: number = 1, selectedOption?: string) => {
        const menuItem = menuItems.find(item => item.title === title);
        
        // Обновляем заказы
        setOrders((prevOrders) => {
            // Если добавляем товар
            if (isAdded) {
                // Создаем новый заказ
                const newOrder = {
                    id: `id-${Date.now()}-${Math.random()}`,
                    title,
                    count,
                    price: menuItem?.price || 0,
                    options: menuItem?.options,
                    selectedOption,
                };
                return [...prevOrders, newOrder]; // Добавляем новый заказ в массив
            } else {
                // Если удаляем товар, находим первый подходящий и уменьшаем количество или удаляем заказ
                const orderIndex = prevOrders.findIndex(order => order.title === title && order.selectedOption === selectedOption);
                if (orderIndex !== -1) {
                    const newOrders = [...prevOrders];
                    if (newOrders[orderIndex].count > 1) {
                        newOrders[orderIndex].count -= count;
                    } else {
                        newOrders.splice(orderIndex, 1);
                    }
                    return newOrders;
                }
            }
            return prevOrders; // Если ничего не добавляем и не удаляем, возвращаем предыдущие заказы
        });
        
        // Обновляем счетчик добавленных элементов
        setAddedItemsCount(prevCount => {
            if (isAdded) {
                return prevCount + count;
            } else {
                return prevCount - count < 0 ? 0 : prevCount - count;
            }
        });
    };
    
    
    

    return (
        
        <Router>
            <MainButtonLogic addedItemsCount={addedItemsCount} orders={orders} alignment={alignment} />
            <Routes>
            <Route path="/orders" element={<OrdersList orders={orders} alignment={alignment} setAlignment={setAlignment} setOrders={setOrders}/>} />
                <Route path="/" element={
                    <div className="menu-container">
                        <Grid container spacing={0.5}>
                            {menuItems.map((item, index) => (
                                <Grid item xs={4} sm={4} md={4} key={index}>
                                    <MenuItem {...item} key={index} onAddChange={handleAddChange} orders={orders} />
                                </Grid>
                            ))}
                        </Grid>
                    </div>
                } />
            </Routes>
        </Router>
    );
};

export default App;
