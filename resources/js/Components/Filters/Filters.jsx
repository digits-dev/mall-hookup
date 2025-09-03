import React, { useEffect } from "react";
import { useState } from "react";
import { useTheme } from "../../Context/ThemeContext";
import useThemeStyles from "../../Hooks/useThemeStyles";
import TableButton from "../Table/Buttons/TableButton";
import { router } from "@inertiajs/react";
import MultiTypeInput from "../Forms/MultiTypeInput";
import CustomSelect from "../Dropdown/CustomSelect";
import InputComponent from "../Forms/Input";

const Filters = ({ filter_inputs }) => {
    const { theme } = useTheme();
    const { primayActiveColor, textColorActive } = useThemeStyles(theme);
    const [pathname, setPathname] = useState(null);
    const initialFormData = filter_inputs.reduce((acc, item) => {
        acc[item.name] = "";
        return acc;
    }, {});

    const [filters, setFilters] = useState(initialFormData);

    useEffect(() => {
        const segments = window.location.pathname.split("/");
        setPathname(segments.pop());
    }, []);

    const handleFilter = (type, attrName, newValue) => {
        if (type != 'value'){
            setFilters((prevFilters) => ({
                ...prevFilters,
                [attrName]: {
                    ...prevFilters[attrName],
                    [type]: newValue.value,
                },
            }));
        }
        else{
            const { value } = newValue.target;
            setFilters((prevFilters) => ({
                ...prevFilters,
                [attrName]: {
                    ...prevFilters[attrName],
                    [type]: value,
                },
            }));
        }
    };

    const sorting = [
        {
            value:'ASCENDING',
            label:'ASCENDING',
        },
        {
            value:'DESCENDING',
            label:'DESCENDING',
        }
    ];
    
    const operators = [
        {
            value:'LIKE',
            label:'LIKE',
        },
        {
            value:'NOT LIKE',
            label:'NOT LIKE',
        },
        {
            value:'=(Equal to)',
            label:'=(Equal to)',
        },
        {
            value:'!= (Not Equal to)',
            label:'!= (Not Equal to)',
        },
        {
            value:'IN',
            label:'IN',
        },
        {
            value:'NOT IN',
            label:'NOT IN',
        },
        {
            value:'Empty (or Null)',
            label:'Empty (or Null)',
        },
    ]

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        const flattenedFilters = {};

        Object.entries(filters).forEach(([key, filterObj]) => {
            if (typeof filterObj === "object" && filterObj !== null) {
                Object.entries(filterObj).forEach(([subKey, subValue]) => {
                    flattenedFilters[`${key}[${subKey}]`] = subValue;
                });
            } else {
                flattenedFilters[key] = filterObj;
            }
        });

        const queryString = new URLSearchParams(flattenedFilters).toString();
        router.get(`${pathname}?${queryString}`);
    };

    return (
        <form>
            <div className="space-y-2">
                {filter_inputs.map((input, index) => (
                    <div className="md:flex items-center justify-between md:space-x-2" key={index}>
                        <div className="flex items-center space-x-2 w-[100px] mr-5">
                            <p className="text-xs font-semibold uppercase text-gray-700">{input.header_name}</p>
                        </div>
                        <CustomSelect
                            placeholder="Select Operator Type"
                            defaultSelect="Select Operator Type"
                            options={operators}
                            maxMenuHeight="70px"
                            addMainClass="md:w-[150px]"
                            onChange={(selectedValue) => handleFilter("operator", input.name, selectedValue)}
                        />

                        <InputComponent
                            placeholder={
                                filters[input.name]?.operator ? 
                                ['IN', 'NOT IN'].includes(filters[input.name]?.operator)
                                    ? 'e.g: Value 1,Value 2,Value 3' :
                                ['Empty (or Null)'].includes(filters[input.name]?.operator) ? ''
                                    : 'e.g: Value'
                                : '' 
                            }
                            disabled={filters[input.name]?.operator ? 
                                ['Empty (or Null)'].includes(filters[input.name]?.operator)
                                    ? true
                                    : false
                                : true}
                            addClass="min-w-[250px] flex-1"
                            onChange={(selectedValue) => handleFilter("value", input.name, selectedValue)}
                        />

                        <CustomSelect
                            placeholder="Sort Order"
                            defaultSelect="Sort Order"
                            options={sorting}
                            addMainClass="md:w-[120px]"
                            onChange={(selectedValue) => handleFilter("sorting", input.name, selectedValue)}
                        />
                    </div>
                ))}
            </div>
            <div className="mt-5 flex justify-end">
                <TableButton
                    extendClass={
                        ["bg-skin-white"].includes(theme)
                            ? primayActiveColor
                            : theme
                    }
                    fontColor={textColorActive}
                    onClick={handleFilterSubmit}
                >
                    <i className="fa fa-filter"></i> Filter
                </TableButton>
            </div>
        </form>
    );
};

export default Filters;
