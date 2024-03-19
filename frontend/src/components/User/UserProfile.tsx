import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';

function UserProfile() {

    const [user, setUser] = useState(null as any);
    const [userTypeMessage, setUserTypeMessage] = useState('');
    let { username } = useParams();
    // takes the value of the token stored during login. Must add to everything that requires auth
    const token = useSelector((auth: any) => auth.token.value);

    useEffect(() => {
        getUser((username as string) ? username as string : '')
        .then(x => { setUser(x); });
    }, [userTypeMessage]);

    async function getUser(username: string) {
        try {
            if (!username) {
                return null;
            }

            let response = await axios.get(`http://localhost:4000/users/${username}`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}` //puts token in the headers
                    }
                });
            const userObj = response && response.data && response.data.user ? response.data.user : null;

            return userObj;
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            {
                user ?
                    <>
                        <p>{userTypeMessage}</p>
                        <p>
                            User: {user.username}
                        </p>
                        <p>
                            Alignment: {user.alignment ? user.alignment : '<not specified>'}
                        </p>
                        <p>
                            {`Wins: ${user.wins} Losses: ${user.losses}`}
                        </p>
                        <p>
                            {`Followers: ${user.followers} Following: ${user.following}`}
                        </p>
                        <p>
                            <CustomHeroLink username={username}/>
                        </p>
                    </>
                    : <></>
            }
        </div>
    )
}

function CustomHeroLink({username=""}) {

    let path = `http://localhost:3000/users/${username}/customhero`;

    return (
        <Link className="nav-link" to={path}>
            See my Custom Hero!
        </Link>
    );
}

export default UserProfile