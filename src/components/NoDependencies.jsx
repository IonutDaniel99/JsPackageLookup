export default function NoDependencies({ titleCheck }) {
    return <th class="w-full py-4" colspan="6">
        <div class="flex items-center w-full justify-center">
            <span><span class="text-slate-400">{titleCheck} </span> is missing from json format.</span>
        </div>
    </th>
}
