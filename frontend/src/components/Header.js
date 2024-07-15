import {
    Newspaper,
    House,
} from 'lucide-react';
import './Header.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

function Header() {
    const [bases, setBases] = useState([]);
    const [tables, setTables] = useState([]);

    useEffect(() => {
        // const GET_RECORDS_API = "http://localhost:8080/api/v2/tables/mylfs53irvwe7dr/records";
        const GET_BASES_API = "http://localhost:8088/api/v2/meta/bases";

        axios.get(GET_BASES_API, {
            headers: {
                "xc-token": process.env.REACT_APP_NOCODB_API_KEY,
            }
        })
            .then((response) => {
                console.log(response.data);
                setBases(response.data.list);
            })
            .catch((error) => {
                console.error(error);
            })
    }, [])

    const handleHoverIn = (e) => {
        const baseId = e.target.id;
        const dropdown = e.target.children[0];
        const GET_TABLES_API = `http://localhost:8088/api/v2/meta/bases/${baseId}/tables`;

        axios.get(GET_TABLES_API, {
            headers: {
                "xc-token": process.env.REACT_APP_NOCODB_API_KEY,
            }
        })
            .then((response) => {
                const tableList = response.data.list;
                for (let table of tableList) {
                    console.log(table);
                    dropdown.innerHTML += `<div id=${table.id}>${table.title}</div>`;
                }
            })
            .catch((error) => {
                console.error(error);
            })
    }

    const handleHoverOut = (e) => {
        const dropdown = e.target.children[0];
        dropdown.innerHTML = '';
    }

    return (
        <div className='header'>
            <div className='logo'>
                <Newspaper color='navy' size={60} />
                <div className='logoText'>News</div>
            </div>
            <div className='navbar'>
                <div className='navItem'>
                    <House color='white' className='navHome' />
                </div>
                {bases.map((base) => (
                    <>
                        <div className='navItem' id={base.id} onMouseEnter={handleHoverIn} onMouseOut={handleHoverOut}>
                            {base.title}
                            <div className='navDropdown'></div>
                        </div>
                    </>
                ))}
            </div>
        </div>
    )
}

export default Header;