import AddressCard from "./AddressCard";

const ShowAddressDetails = ({addressDetails}) => {
    return(
        <div>
            {addressDetails.length > 0 ? (
                    addressDetails.map((addr) => (
                    <AddressCard
                        key={addr._id}
                        addrId={addr.addrId}
                        houseNumber={addr.houseNumber}
                        name={addr.name}
                        area={addr.area}
                        city={addr.city}
                        state={addr.state}
                        pincode={addr.pincode}
                        isDefault={addr.isDefault}
                    />
                    ))
            ):(
                <p className="text-gray-400 italic">No Addresses Added.</p>
            )}
        </div>
    )
}

export default ShowAddressDetails;