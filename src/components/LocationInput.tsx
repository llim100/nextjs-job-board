import React, { forwardRef, useState, useMemo } from "react";
import { Input } from "./ui/input";
import citiesList from "@/lib/cities-list";
import { ClipboardType } from "lucide-react";

interface LocationInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onLocationSelected: (location: string) => void; //triggered when we click a location in the search
}

//we need a ref here b/c RHF needs a ref to put focus on an input field that has invalid values

export default forwardRef<HTMLInputElement, LocationInputProps>(
  function LocationInput({ onLocationSelected, ...props }, ref) {
    const [locationSearchInput, setLocationSearchInput] = useState("");
    const [hasFocus, setHasFocus] = useState(false);

    const cities = useMemo(() => {
      if (!locationSearchInput.trim()) return [];

      const searchWords = locationSearchInput.split(" ");

      return citiesList
        .map((city) => `${city.name}, ${city.subcountry}, ${city.country} `)
        .filter(
          (city) =>
            city.toLowerCase().startsWith(searchWords[0].toLowerCase()) &&
            searchWords.every((word) =>
              city.toLowerCase().includes(word.toLowerCase()),
            ),
        )
        .slice(0, 5);
    }, [locationSearchInput]);

    return (
      <div className="relative">
        <Input
          placeholder="Search for a city"
          type="search"
          value={locationSearchInput}
          onChange={(e) => setLocationSearchInput(e.target.value)}
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
          {...props}
          ref={ref}
        />
        {locationSearchInput.trim() && hasFocus && (
          <div className="absolute z-20 w-full divide-y rounded-b-lg border-x bg-background shadow-xl">
            {!cities.length && <p>No results found</p>}
            {cities.map((city) => (
              <button
                key={city}
                className="block w-full p-2 text-start"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onLocationSelected(city);
                  setLocationSearchInput("");
                }}
              >
                {city}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  },
);

//LocationInput has a search functionality (that we will implement here)

//cities.map((city) =>  will map to a list, but here we use a list of buttons so if a button is clicked, it will trigger
//onLocationSelected() event handler. We use an unstyled button, not our custom button.
//buttons are pop-up; div that directly encloses <button> is absolute and the one enclosing it is relative.
//z-20 also makes sure they are on top of other elements
//the button and its contents are on top of the rest of the form
//button block, each button takes up its own line; w-full to take up the available width

//Input. spread the props, ...props last, you can override the attributes above it from outside with the passed on props
//type of input as 'search', x that can clear the input

//to show the search results only when LocationInput is focused and not when you click another button after
//you created a search, do these. First, create a state to manage focus, [hasFocus, setFocus] = useState(false)
//In Input, add a handler for onFocus (when element is on focus) and onBlur (when element loses focus);
//next add hasFocus on the search result list of buttons.
//when one of the search results is clicked we want to pass onLocationSelected(). We can this not on onClick but
//on onMouseDown() because if we use onclick, we lose focus before the click is received (when we lose focus, we lose the results).
//e.preventDefault(); avoids losing focus

//keep
// return (
//   <div>
//     <Input
//       value={locationSearchInput}
//       {...props}
//       ref={ref}
//       onChange={(e) => setLocationSearchInput(e.target.value)}
//     />
//     {JSON.stringify(cities)}
//   </div>
// );
