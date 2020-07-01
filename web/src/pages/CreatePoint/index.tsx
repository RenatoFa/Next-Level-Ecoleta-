import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link , useHistory} from 'react-router-dom';
import './styles.css'
import { FiArrowLeft } from 'react-icons/fi';
import logo from '../../assets/logo.svg';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import api from '../../services/api';
import axios from 'axios';


const CreatePoint = () => {

    // array ou objeto: manualmente informar o tipo da variavel

    interface Item {
        id: number,
        title: string,
        image_url: string;

    }

    interface IBGEUFResponse {

        sigla: string;
    }

    interface IBGECityResponse {

        nome: string;
    }


    const [items, setItems] = useState<Item[]>([]) // Criar um estado para item no React
    const [ufs, setUfs] = useState<string[]>([]);  // Criar um estado para UF no React
    const [cities, setCities] = useState<string[]>([]);  // Criar um estado para Cidades no React
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
    });


    const [initialPosition, setInitalPosition] = useState<[number, number]>([0, 0])//Cria um estado para armazenar a Posição inicial do usuario
    const [selectedUF, setSelectedUF] = useState('0');// Cria um estado para armazenar o Estado que o usuario colocou
    const [selectedCity, setSelectedCity] = useState('0');// Cria um estado para armazenar a Cidade que o usuario colocou
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);// Cria um estado para armazenar a Posição apontada pelo usuario 
    const [selectedItems,setSelectedItems] = useState<number[]>([]) // Cria um estado para armazenar os Itens selecionados pelo usuario
    const history = useHistory();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;

            setInitalPosition([latitude, longitude]);
        })
    }, [])



    useEffect(() => {
        // Carregar os Items
        api.get('items').then(response => {
            setItems(response.data)
        });
    }, []);

    useEffect(() => {
        // Carregar os Estados
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla)

            setUfs(ufInitials);

        });
    }, []);

    useEffect(() => {
        //Carregar os Municipios sempre que a UF mudar
        if (selectedUF === '0') {
            return;
        }
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`).then(response => {
            const cityNames = response.data.map(city => city.nome)

            setCities(cityNames);
            console.log(setCities(cityNames))


        });
    }, [selectedUF]);

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) { // Função que retorna o valor no Uf do usuario
        const uf = event.target.value;

        setSelectedUF(uf);
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) { // Função que retorna o valor no Uf do usuario
        const city = event.target.value;

        setSelectedCity(city);
    }
    function handleMapClick(event: LeafletMouseEvent) {
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ])
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        // Manter os dados que eu ja tenho 
        const { name, value } = event.target
        setFormData({ ...formData, [name]: value });
    }

    function handleSelectItem(id: number) { // não posso alterar o valor do estado no React
        //setSelectedItems([...selectedItems,id]); // funciona para selecionar varios itens mas não consigo retirar os itens 

        // Logica para permitir retirar os items no array de items
        const alreadySelected = selectedItems.findIndex(item=> item=== id)

        if(alreadySelected >= 0){

            const filteredItems = selectedItems.filter(item =>item!==id)
            setSelectedItems(filteredItems);

        }else{

            setSelectedItems([...selectedItems,id]); 
            
        }
        
        


    }

    async function handleSubmit(event:FormEvent){ // sempre como evento pois se nao vai mandar o usuario para outra tela
         event.preventDefault();
         
         const {name,email, whatsapp} = formData;
         const uf = selectedUF;
         const city = selectedCity;
         const [latitude,longitude] = selectedPosition;
         const items = selectedItems;


         const data ={
             name,
             email,
             whatsapp,
             uf,
             city,
             latitude,
             longitude,
             items

         };

         // Conexão com o Back-End

         await api.post('points',data);

         alert('Ponto de Coleta Criado');

         history.push('/')



         


    }



    return (
        <div id="page-create-point">
            <header>
                <Link to='/'>
                    <img src={logo} alt="Ecoleta" />

                </Link>

                <Link to='/'>
                    <FiArrowLeft />
                   Voltar para home
               </Link>

            </header>
            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br /> ponto de coleta</h1>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        />

                    </div>

                    <div className="field-group">

                        <div className="field">
                            <label htmlFor="name">E-mail</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                            />

                        </div>

                        <div className="field">
                            <label htmlFor="name">Whatsapp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                            />

                        </div>




                    </div>

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço do mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={15} onclick={handleMapClick}  >
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

                        />
                        <Marker position={initialPosition} />
                        <Marker position={selectedPosition} />

                    </Map>
                    <div className="field-group">

                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select name="uf" id="uf" value={selectedUF} onChange={handleSelectUf}>
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (

                                    <option key={uf} value={uf}>{uf}</option>

                                ))}


                            </select>

                            <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>
                                <option value="0">Selecione uma cidade</option>
                                {cities.map(city => (

                                    <option key={city} value={city}>{city}</option>

                                ))}





                            </select>




                        </div>




                        </div>

                       



                    </div>

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(item => (
                            <li key={item.id} onClick={() => handleSelectItem(item.id)} className={selectedItems.includes(item.id)?'selected':'id'}>

                                <img src={item.image_url} alt="item.title" />
                                <span>{item.title}</span>

                            </li>
                        ))}

                    </ul>

                </fieldset>

                <button type="submit">

                    Cadastrar ponto de coleta

                </button>




            </form>


        </div>
    )
}


export default CreatePoint;