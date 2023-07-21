/* eslint-disable no-use-before-define */
import VanillaSelectionArea from '@viselect/vanilla';
import {SelectionEvents, SelectionOptions} from '@viselect/vanilla';
import {createContext, createRef, FunctionalComponent} from 'preact';
import {HTMLAttributes, useContext} from 'preact/compat';
import {useEffect, useState} from 'preact/hooks';

export interface SelectionAreaProps extends Omit<Partial<SelectionOptions>, 'boundaries'>, HTMLAttributes<HTMLDivElement> {
    id?: string;
    className?: string;
    onBeforeStart?: SelectionEvents['beforestart'];
    onBeforeDrag?: SelectionEvents['beforedrag'];
    onStart?: SelectionEvents['start'];
    onMove?: SelectionEvents['move'];
    onStop?: SelectionEvents['stop'];
}

const SelectionContext = createContext<VanillaSelectionArea  | undefined>(undefined);

export const useSelection = () => useContext(SelectionContext);

export const SelectionArea: FunctionalComponent<SelectionAreaProps> = props => {
    const [selectionState, setSelection] = useState<VanillaSelectionArea | undefined>(undefined);
    const root = createRef<HTMLDivElement>();

    useEffect(() => {
        const {onBeforeStart, onBeforeDrag, onStart, onMove, onStop, ...opt} = props;
        const areaBoundaries = root.current as HTMLElement;

        const selection = new VanillaSelectionArea({
            boundaries: areaBoundaries,
            ...opt
        });

        onBeforeStart && selection.on('beforestart', onBeforeStart);
        onBeforeDrag && selection.on('beforedrag', onBeforeDrag);
        onStart && selection.on('start', onStart);
        onMove && selection.on('move', onMove);
        onStop && selection.on('stop', onStop);

        setSelection(selection);

        return () => {
            selection.destroy();
            setSelection(undefined);
        };
    }, []);

    return (
        <SelectionContext.Provider value={selectionState}>
            <div ref={root} className={props.className} id={props.id}>
                {props.children}
            </div>
        </SelectionContext.Provider>
    );
};
