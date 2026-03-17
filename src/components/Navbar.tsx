import { useState, type ReactNode } from 'react'
import { Slider } from 'primereact/slider';
import './Navbar.css'
import { InputNumber, type InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Menubar } from 'primereact/menubar';

        

interface NavbarProps{
    title: ReactNode,
    children?: ReactNode,
}

export const Navbar = ({title, children}:NavbarProps) => {
    const [value, setValue] = useState(1);

    const items = [
        {
            // label: 'Test',
            icon: 'pi pi-fw pi-bars',
            items:[
                {
                    label: 'File',
                    icon: 'pi pi-fw pi-file',
                    items: [
                        {
                            label: 'New',
                            icon: 'pi pi-fw pi-plus',
                            items: [
                                {
                                    label: 'Bookmark',
                                    icon: 'pi pi-fw pi-bookmark',
                                },
                                {
                                    label: 'Video',
                                    icon: 'pi pi-fw pi-video',
                                },
                            ],
                        },
                        {
                            label: 'Delete',
                            icon: 'pi pi-fw pi-trash',
                        },
                        {
                            separator: true,
                        },
                        {
                            label: 'Export',
                            icon: 'pi pi-fw pi-external-link',
                        },
                    ],
                },
                {
                    label: 'Edit',
                    icon: 'pi pi-fw pi-pencil',
                    items: [
                        {
                            label: 'Left',
                            icon: 'pi pi-fw pi-align-left',
                        },
                        {
                            label: 'Right',
                            icon: 'pi pi-fw pi-align-right',
                        },
                        {
                            label: 'Center',
                            icon: 'pi pi-fw pi-align-center',
                        },
                        {
                            label: 'Justify',
                            icon: 'pi pi-fw pi-align-justify',
                        },
                    ],
                },
                {
                    label: 'Users',
                    icon: 'pi pi-fw pi-user',
                    items: [
                        {
                            label: 'New',
                            icon: 'pi pi-fw pi-user-plus',
                        },
                        {
                            label: 'Delete',
                            icon: 'pi pi-fw pi-user-minus',
                        },
                        {
                            label: 'Search',
                            icon: 'pi pi-fw pi-users',
                            items: [
                                {
                                    label: 'Filter',
                                    icon: 'pi pi-fw pi-filter',
                                items: [
                                    {
                                        label: 'Print',
                                        icon: 'pi pi-fw pi-print',
                                    },
                                ],
                                },
                                {
                                    icon: 'pi pi-fw pi-bars',
                                    label: 'List',
                                },
                            ],
                        },
                    ],
                },
                {
                    label: 'Events',
                    icon: 'pi pi-fw pi-calendar',
                    items: [
                        {
                            label: 'Edit',
                            icon: 'pi pi-fw pi-pencil',
                            items: [
                                {
                                    label: 'Save',
                                    icon: 'pi pi-fw pi-calendar-plus',
                                },
                                {
                                    label: 'Delete',
                                    icon: 'pi pi-fw pi-calendar-minus',
                                },
                            ],
                        },
                        {
                            label: 'Archive',
                            icon: 'pi pi-fw pi-calendar-times',
                            items: [
                                {
                                    label: 'Remove',
                                    icon: 'pi pi-fw pi-calendar-minus',
                                },
                            ],
                        },
                    ],
                }
            ]
        }
    ];

    return (
        <div className='NavbarMain'>
            <div className="card">
                <Menubar model={items} />
            </div>
            <div className='NavbarSpacer'></div>
            <h2>{title}</h2>
            <div className='NavbarSpacer'></div>
            <div className='Clock'>
                <h4>Time</h4>
                <div className="card flex justify-content-center">
                    <Slider 
                        value={value} 
                        onChange={(e) => setValue(e.value)} 
                        className="w-14rem"
                        min={1}
                        max={10}

                    />
                    <InputNumber 
                        value={value} 
                        onValueChange={(e: InputNumberValueChangeEvent) => setValue(e.value)} 
                        mode="decimal"
                        showButtons
                        min={1}
                        max={10}
                    />
                </div>
            </div>
        </div>
    )
}