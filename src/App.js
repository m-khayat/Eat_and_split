import React, { useState } from "react";
import "./index.css";
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [AddFriendIsOpen, setAddFriendIsOpen] = useState(false);
  const [selectedFriend, setselectedFriend] = useState(null);
  const [friends, setFriends] = useState(initialFriends);

  function handleDisplaySplitBill(friend) {
    setselectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setAddFriendIsOpen(false);
  }

  function handleDisplayNewFriend() {
    setAddFriendIsOpen(!AddFriendIsOpen);
  }

  function handleAddFriends(friend) {
    setFriends((friends) => [...friends, friend]);
    setAddFriendIsOpen(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  }
  return (
    <div className="app">
      <div className="sidebar">
        {AddFriendIsOpen ? (
          <div>
            <FriendsList
              friends={friends}
              handleDisplaySplitBill={handleDisplaySplitBill}
              selectedFriend={selectedFriend}
            />
            <AddFriend handleAddFriends={handleAddFriends} />
          </div>
        ) : (
          <FriendsList
            friends={friends}
            handleDisplaySplitBill={handleDisplaySplitBill}
            selectedFriend={selectedFriend}
          />
        )}

        <Button onClick={handleDisplayNewFriend}>
          {AddFriendIsOpen ? " close " : "add friend"}
        </Button>
      </div>
      {selectedFriend ? (
        <SplitBill
          key={selectedFriend.id}
          handleSplitBill={handleSplitBill}
          selectedFriend={selectedFriend}
          setselectedFriend={setselectedFriend}
        />
      ) : null}
    </div>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FriendsList({ handleDisplaySplitBill, friends, selectedFriend }) {
  return (
    <ul className="sidebar">
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          handleDisplaySplitBill={handleDisplaySplitBill}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, handleDisplaySplitBill, selectedFriend }) {
  return (
    <li className={friend == selectedFriend ? "selected" : ""}>
      <h3>{friend.name}</h3>
      <img src={friend.image} alt="dff" />
      {friend.balance < 0 && (
        <p className="red">
          you owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}$
        </p>
      )}

      {friend.balance == 0 && <p>you and {friend.name} are even</p>}
      <Button onClick={() => handleDisplaySplitBill(friend)}>
        {friend == selectedFriend ? "close" : "select"}
      </Button>
    </li>
  );
}

function AddFriend({ handleAddFriends }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleEvent(e) {
    e.preventDefault();
    const id = crypto.randomUUID();

    if (name == "" || image == "") return;
    const newFriend = { id: id, name, image: `${image}?u=${id}`, balance: 0 };
    const newFriendsList = handleAddFriends(newFriend);
    console.log(newFriendsList);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleEvent}>
      <label>👭Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>🖼Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function SplitBill({ selectedFriend, handleSplitBill, setselectedFriend }) {
  const [bill, setBill] = useState("");
  const [myExpense, setMyExpense] = useState("");
  const [whoPaying, setWhoPaying] = useState("user");
  const FriendExpense = bill - myExpense;
  // console.log(newBalance);
  function handleEvent(e) {
    e.preventDefault();
    if (!bill || !myExpense) return;
    handleSplitBill(whoPaying === "user" ? FriendExpense : -myExpense);
    setselectedFriend(null);
  }
  return (
    <form className="form-split-bill" onSubmit={handleEvent}>
      <h2>split a bill with {selectedFriend.name}</h2>

      <label>💰bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>👤your expense</label>
      <input
        type="text"
        value={myExpense}
        onChange={(e) => setMyExpense(Number(e.target.value))}
      />

      <label>👥{selectedFriend.name}'s expense</label>
      <input type="text" disabled value={FriendExpense} />

      <label>🤑who is paying the bill?</label>
      <select value={whoPaying} onChange={(e) => setWhoPaying(e.target.value)}>
        <option value="user">you</option>
        <option value={selectedFriend.name}>{selectedFriend.name}</option>
      </select>

      <Button>split bill</Button>
    </form>
  );
}
