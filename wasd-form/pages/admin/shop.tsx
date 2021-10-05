import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import Preloader from '../../components/shared/Preloader';
import AdminDashboardRoot from '../../components/admin/AdminDashboardRoot';
import styles from '../../styles/admin.module.css';
import DashboardCard from '../../components/admin/DashboardCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faDollarSign, faFile, faSubscript, faUser, faWalking, faWallet } from '@fortawesome/free-solid-svg-icons';
import { getUsersIncartItems } from '../../stores/actions/adminActions';
import ItemCard from '../../components/shop/ItemCard';
import ModelContainer from '../../components/models/ModelContainer';
import Requester from '../../requests/Requester';
import { ADD_STORE_ITEM, API } from '../../requests/config';
import { appendShopItem } from '../../stores/actions/shopItemsActions';
import Dropdown from './../../components/shared/Dropdown';

const Requester_ = new Requester(API);

export default function adminShopManager() {
    const [isLoading, setLoading] = useState(true);
    const [modelPopupActive, setModelPopupActive] = useState(false);
    const [error, setError] = useState("");
    const [addItemData, setAddItemData] = useState({ name: "Item Name", description: "Item Description", price: "", stock: 100});

    const dispatch = useDispatch();

    let userStore = useSelector(state => state.user.user);

    let adminDashboardStore = useSelector(state => state.adminStore);

    const onLoadRequests = () => {
        dispatch(getUsersIncartItems(userStore.api_key));
    }

    useEffect(() => {
        if(userStore){
            if(userStore.username){
                if(userStore.permissions.includes("ADMINISTRATOR")) {
                    setLoading(false);
                    onLoadRequests();
                    
                } else {
                    Router.push("/fourm")  
                }
            }
        } 
    }, [userStore]);

    useEffect(() => {
        console.log(adminDashboardStore);
    }, [adminDashboardStore]);

    const submitCreateNewItem = () => {

        if(!addItemData.name ||addItemData.name == "") return setError("You must provide a name for the product!");
        if(!addItemData.price || addItemData.price == "") return setError("You must provide a price for the product!");  
        if(!addItemData.description || addItemData.description == "") return setError("You must provide a description for the product!");  

        Requester_.makePostRequest(ADD_STORE_ITEM, {
            name: addItemData.name,
            price: addItemData.price,
            stock: 100,
            imgUrl: "",
            description: addItemData.description
        }, {
            queryStringParams: [],
            headers: {
                authorization: userStore.api_key
            }
        }).then((res) => {
            if(!res.error){
                dispatch(appendShopItem(res.item));
            } else {
                setError(res.errors);
            }
        }).catch((err) => {
            setError(err);
        });
    }

    if(isLoading) return <Preloader />;

    return (
        <div>
            <ModelContainer isActive={modelPopupActive} setModelActive={setModelPopupActive}>
                <div className={styles.model_popup_container}>
                    <h1 className={styles.action_heading}>Create a new item!</h1>
                    <p className={styles.action_description}>you're creating a shop item, this item will be displayed to all users once you click submit, if you're looking for a way to set the currency of something please go to the shop settings</p>
                    <p>Item Name</p>
                    <input onChange={(e) => setAddItemData({ ...addItemData, name: e.target.value })} placeholder={"Item Name"} className={styles.admin_input}></input>
                    <p>Item Price</p>
                    <input onChange={(e) => setAddItemData({ ...addItemData, price: e.target.value })} placeholder={"Item Price (ex: 150)"} className={styles.admin_input}></input>
                    <p>Item description</p>
                    <textarea onChange={(e) => setAddItemData({ ...addItemData, description: e.target.value })} placeholder={"Item Price (ex: 150)"} className={styles.admin_input}></textarea>
                    <p>What role should this product add to the user?</p>
                    <Dropdown choices={["ROLE1", "ROLE2"]}/>
                    <p>Live Card preview</p>
                    <div className={styles.model_popup_centered}>
                        <ItemCard name={addItemData.name} price={addItemData.price} description={addItemData.description}  />
                    </div>
                    <div style={{ marginTop: "10px", marginBottom: "10px"}}>
                        <button className={styles.button} onClick={() => submitCreateNewItem()}>Add product</button>
                    </div>
                </div>
            </ModelContainer>
            <AdminDashboardRoot>
                <div className={styles.dashboard_container}>
                    <h1>Manage your store.</h1>

                    <div className={styles.dash_items_container}>
                        <DashboardCard>
                            <h3>Active subscriptions</h3>
                            <h1><FontAwesomeIcon icon={faCheck} /> 500</h1>
                        </DashboardCard>
                        <DashboardCard>
                            <h3>Users with items in their cart</h3>
                            <h1><FontAwesomeIcon icon={faUser} /> {adminDashboardStore.in_cart}</h1>
                        </DashboardCard>
                        <DashboardCard>
                            <h3>Completed Transactions</h3>
                            <h1><FontAwesomeIcon icon={faWallet} /> 5582</h1>
                        </DashboardCard>
                        <DashboardCard>
                            <h3>Total Transaction Value</h3>
                            <h1><FontAwesomeIcon icon={faDollarSign} /> 77322</h1>
                        </DashboardCard>
                    </div>
                    <div className={styles.store_items_list}>
                        <button className={styles.button} onClick={() => setModelPopupActive(true)}>Add a new product</button>
                    </div>
                </div>
            </AdminDashboardRoot>
        </div>
    )
}