import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import Preloader from '../../components/shared/Preloader';
import AdminDashboardRoot from '../../components/admin/AdminDashboardRoot';
import styles from '../../styles/admin.module.css';
import DashboardCard from '../../components/admin/DashboardCard';
import ItemCard from '../../components/shop/ItemCard';
import ModelContainer from '../../components/models/ModelContainer';
import Requester from '../../requests/Requester';
import Dropdown from './../../components/shared/Dropdown';
import WASDTable from '../../components/shared/Table';
import { ADD_STORE_ITEM, ADD_SUBSCRIPTION, API, DELETE_SUBSCRIPTIONS } from '../../requests/config';
import { appendShopItem, GetItems } from '../../stores/actions/shopItemsActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faDollarSign, faFile, faPen, faSubscript, faTrash, faUser, faWalking, faWallet } from '@fortawesome/free-solid-svg-icons';
import { appendShopSubscriptions, deleteSubscriptionItem, getShopSubscriptions, getUsersIncartItems } from '../../stores/actions/adminActions';

const Requester_ = new Requester(API);

export default function adminShopManager() {

    const [isLoading, setLoading] = useState(true);
    const [modelPopupActive, setModelPopupActive] = useState(false);
    const [subscriptionModelPopup, setSubscriptionModelPopup] = useState(false);
    const [error, setError] = useState("");
    const [addItemData, setAddItemData] = useState({ name: "Item Name", description: "Item Description", price: 0, stock: 100, subscription_id: ""});
    const [addSubscriptionData, setSubscriptionData] = useState({ name: "", timespan: 0, timespan_type: "DAYS" });
    const [subscriptionDeletePopup, setSubscriptionDeletePopup] = useState(false);
    const [deletingItemId, setDeletingItemID] = useState("");

    //For when a user is editing a product
    const [currentProduct, setCurrentProduct] = useState({});
    const [editProductPopupActive, setEditProductPopupActive] = useState(false);

    const dispatch = useDispatch();

    let userStore = useSelector(state => state.user.user);
    let adminDashboardStore = useSelector(state => state.adminStore);
    let adminSubscriptions = useSelector(state => state.adminStore.subscriptions);
    let storeProducts = useSelector(state => state.shopStore.items);


    const onLoadRequests = () => {
        dispatch(getUsersIncartItems(userStore.api_key));
        dispatch(getShopSubscriptions(userStore.api_key));
        dispatch(GetItems());
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
            description: addItemData.description,
            subscription: addItemData.subscription_id
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

    const submitCredateSubscription = () => {
        if(!addSubscriptionData.name || addSubscriptionData.name == "") setError("You must provide a name for a subscription!");
        if(!addSubscriptionData.timespan || addSubscriptionData.timespan == 0) setError("You must provide a timespan for a subscription!");

        let timespanMilliseconds = 0;

        switch(addSubscriptionData.timespan_type){
            case "DAYS":
                timespanMilliseconds =  addSubscriptionData.timespan * 8.64e+7;
                break;
            case "MONTHS":
                timespanMilliseconds =  addSubscriptionData.timespan * 2.628e+9;
                break;
            case "HOURS":
                timespanMilliseconds = addSubscriptionData.timespan * 3.6e+6;
                break;
            case "WEEKS":
                timespanMilliseconds = addSubscriptionData.timespan *  6.048e+8;
                break;
            default: 
                setError("you must provide a timespan for your subscription!");
        }

        Requester_.makePostRequest(ADD_SUBSCRIPTION, {
            name: addSubscriptionData.name,
            time_span: timespanMilliseconds
        }, {
            queryStringParams: [],
            headers: {
                authorization: userStore.api_key
            }
        }).then((res) => {
            if(res.error == true){
                setError(res.errors);
            } else {
                dispatch(appendShopSubscriptions(res.subscription));
                setSubscriptionModelPopup(false);
            }
        }).catch((err) => {
            setError(err);
        });
    }

    const deleteSubscripton = (id: string) => {
        dispatch(deleteSubscriptionItem(id, userStore.api_key));
    }

    const editItem = (item: string) => {
        setCurrentProduct(item);
        setEditProductPopupActive(true);
    }

    const updateProduct = () => {

    }

    if(isLoading) return <Preloader />;

    return (
        <div>
            <ModelContainer key={"EditItemPopup"} isActive={editProductPopupActive} setModelActive={setEditProductPopupActive}>
                <div className={styles.model_popup_container}>
                    <h1 className={styles.action_heading}>You're editing {currentProduct?.name}</h1>
                    <p>Item Name</p>
                    <input onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })} value={currentProduct?.name} placeholder={"Item Name"} className={styles.admin_input}></input>
                    <p>Item Price</p>
                    <input onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })} placeholder={"Item Price (ex: 150)"} value={currentProduct?.price} className={styles.admin_input}></input>
                    <p>Item description</p>
                    <textarea onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })} placeholder={"Description"} value={currentProduct?.description} className={styles.admin_input}></textarea>
                    <p>What subscription should the user get? (to add a subscription please go to your shop dashboard and add a new subscription) (item will be displayed with ID)</p>
                    <Dropdown choices={adminSubscriptions.map((i) => { return { name: i.name, data: i.id } })} output={(o) => setCurrentProduct({ ...currentProduct, subscription_id: o})} default_state={currentProduct?.subscription_id} />
                    <div style={{ marginTop: "10px", marginBottom: "10px"}}>
                        <button className={styles.button} onClick={() => updateProduct()}>Update Product</button>
                    </div>
                </div>
            </ModelContainer>
            <ModelContainer key={"SubscriptonDeletePopup"} isActive={subscriptionDeletePopup} setModelActive={setSubscriptionDeletePopup}>
                <div className={styles.model_popup_container}>
                    <h1>Are you sure you want to delete this subscription?</h1>
                    <p>Deleting this subscription will unbind it from all of the products its tied to, the users that have this active subscription will still have what they paid for, just you will no longer be allowed to purchase the item that the subscription has been tied too.</p>
                    <div style={{ marginTop: "10px", marginBottom: "10px"}}>
                        <button className={styles.button} onClick={() => setSubscriptionDeletePopup(false)}>Cancel</button>
                        <button className={`${styles.button} ${styles.button_delete}`} onClick={() => deleteSubscripton(deletingItemId)}>Delete</button>
                    </div>
                </div>
            </ModelContainer>
            <ModelContainer key={"CreateNewItemPopup"} isActive={modelPopupActive} setModelActive={setModelPopupActive}>
                <div className={styles.model_popup_container}>
                    <h1 className={styles.action_heading}>Create a new item!</h1>
                    <p className={styles.action_description}>you're creating a shop item, this item will be displayed to all users once you click submit, if you're looking for a way to set the currency of something please go to the shop settings</p>
                    <p>Item Name</p>
                    <input onChange={(e) => setAddItemData({ ...addItemData, name: e.target.value })} placeholder={"Item Name"} className={styles.admin_input}></input>
                    <p>Item Price</p>
                    <input onChange={(e) => setAddItemData({ ...addItemData, price: e.target.value })} placeholder={"Item Price (ex: 150)"} className={styles.admin_input}></input>
                    <p>Item description</p>
                    <textarea onChange={(e) => setAddItemData({ ...addItemData, description: e.target.value })} placeholder={"Description"} className={styles.admin_input}></textarea>
                    <p>What subscription should the user get? (to add a subscription please go to your shop dashboard and add a new subscription) (item will be displayed with ID)</p>
                    <Dropdown choices={adminSubscriptions.map((i) => { return { name: i.name, data: i.id } })} output={(o) => setAddItemData({ ...addItemData, subscription_id: o})} />
                    <p>Live Card preview</p>
                    <div className={styles.model_popup_centered}>
                        <ItemCard name={addItemData.name} price={addItemData.price} description={addItemData.description}  />
                    </div>
                    <div style={{ marginTop: "10px", marginBottom: "10px"}}>
                        <button className={styles.button} onClick={() => submitCreateNewItem()}>Add product</button>
                    </div>
                </div>
            </ModelContainer>
            <ModelContainer key={"SetSubscripitonPopup"} isActive={subscriptionModelPopup} setModelActive={setSubscriptionModelPopup}>
                <div className={styles.model_popup_container}>
                    <h1>Create Subscription</h1>
                    <p>Subscription Name</p>
                    <input placeholder={"subscription name"} onChange={(e) => setSubscriptionData({ ...addSubscriptionData, name: e.target.value })} className={styles.admin_input}></input>
                    <p>Subscription Timespan</p>
                    <div className={styles.model_popup_content_sidebyside}>
                        <input onChange={(e) => {
                            if(isNaN(parseInt(e.target.value)) && e.target.value !== "") {
                                setError("timespan must be a number!");
                            } else {
                                setSubscriptionData({ ...addSubscriptionData, timespan: isNaN(parseInt(e.target.value)) ? 0 :parseInt(e.target.value) });
                            }
                        }} placeholder={""} value={addSubscriptionData.timespan} className={styles.admin_input}></input>
                        <Dropdown output={(data) => setSubscriptionData({ ...addSubscriptionData, timespan_type: data.toUpperCase()})} choices={[{ name: "Months", data: "months" }, { name: "Weeks", data: "weeks" }, { name: "Days", data: "days" }, { name: "Hours", data: "hours" } ]}></Dropdown>
                    </div>
                    <div style={{ marginTop: "10px", marginBottom: "10px"}}>
                        <button className={styles.button} onClick={() => submitCredateSubscription()}>Add Subscription</button>
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
                        <button className={styles.button} style={{ marginLeft: "10px" }} onClick={() => setSubscriptionModelPopup(true)}>Add a new subscription</button>
                        <h2>Subscription types:</h2>
                        <WASDTable 
                                table_data={adminSubscriptions.map((i: any) => {
                                    return (
                                        <tr key={i.name} id={i.id}>
                                            <th>{i.name}</th>
                                            <th>{i.time_span}</th>
                                            <th>{i.id}</th>
                                            <th><span onClick={() => {
                                                setDeletingItemID(i.id);
                                                setSubscriptionDeletePopup(true);
                                            }}><FontAwesomeIcon icon={faTrash} /></span><span><FontAwesomeIcon icon={faPen} /></span></th>
                                        </tr>
                                    )
                                })}
                                table_colomns={[
                                    "Name",
                                    "Timespan (milliseconds)",
                                    "API ID",
                                    "Actions"
                                ]}
                        />
                        <h2>Products:</h2>
                        <WASDTable 
                            table_colomns={[
                                "Name",
                                "Price",
                                "Linked Subscription",
                                "API ID",
                                "Currency",
                                "Image",
                                "Description",
                                "Actions"
                            ]}

                            table_data={storeProducts.map(i => {
                                return (
                                    <tr key={i.name}>
                                        <th>{i.name}</th>
                                        <th>{i.price}</th>
                                        <th>{i.subscription_id}</th>
                                        <th>{i.id}</th>
                                        <th>{i.currency}</th>
                                        <th>{i.image}</th>
                                        <th>{i.description}</th>
                                        <th><span><FontAwesomeIcon icon={faTrash} /></span><span onClick={() => {
                                            editItem(i);
                                        }}><FontAwesomeIcon icon={faPen} /></span></th>
                                    </tr>
                                )
                            })}
                        />
                    </div>
                </div>
            </AdminDashboardRoot>
        </div>
    )
}