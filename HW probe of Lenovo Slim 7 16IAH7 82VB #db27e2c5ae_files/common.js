function sort(el, dr)
{
    if(dr == null) {
        dr = 0;
    }
    
    var col_sort = el.innerHTML;
    var tr = el.parentNode;
    var table = tr.parentNode;
    var td, col_sort_num;
    
    if (typeof el.prev === 'undefined') {
        el.prev = dr;
    }
    
    for (var i=0; (td = tr.getElementsByTagName('th').item(i)); i++)
    {
        if(td.innerHTML == col_sort)
        {
            col_sort_num = i;
            
            if (typeof el.up === 'undefined' || el.prev==0) {
                el.up = dr;
            }
            else {
                el.up = Number(!el.up);
            }
            
            el.prev = 1;
        }
        else
        {
            td.prev = 0;
        }
    }
    
    var a = new Array();
    for(i=1; i < table.rows.length; i++)
    {
        a[i-1] = new Array();
        a[i-1][0] = get_text(table.rows[i].getElementsByTagName('td').item(col_sort_num)); // sort by this
        a[i-1][1] = rm_arrow(col_sort); // column name
        a[i-1][2] = table.rows[i]; // original row
    }
    
    a.sort(sort_array);
    if(el.up) a.reverse();
    
    for(i=0; i < a.length; i++) {
        table.appendChild(a[i][2]);
    }
    
    for (var i=0; (th = tr.getElementsByTagName('th').item(i)); i++)
    {
        th.innerHTML = rm_arrow(th.innerHTML);
        if(i==col_sort_num) {
            th.innerHTML = add_arrow(th.innerHTML, el.up);
        }
    }
}

function get_text(item)
{
    return item.textContent || item.innerText || item.innerHTML || '';
}

function rm_arrow(cont) {
    return cont.replace(/<br>(\&[du]arr\;|↑|↓)/g, '');
}

function add_arrow(cont, up)
{
    if(up) {
        return cont+'<br/>&uarr;';
    }
    return cont+'<br/>&darr;';
}

function is_number(a)
{
    if(a.match(/^\d+(|\.\d+)$/) && !a.match(/^0\d+$/)) {
        return 1;
    }
    
    return 0;
}

function simple_val(val, val_type)
{
    val = val.toLowerCase();
    
    if(val.substr(val.length-1, 1)=="%") {
        val = parseInt(val.substr(0, val.length-1)*100);
    }
    else if(val.includes('<a')) {
        val = val.replace(/<a.+>(.*?)<.+/mg, "\$1");
    }
    
    if(val_type!='ID' && is_number(val)) {
        val = parseInt(val*100);
    }
    
    if(val_type=='BUS') {
        val = rm_nx(val);
    }
    
    return val;
}

function cmp_values(a, b, at, bt)
{
    a = simple_val(a, at);
    b = simple_val(b, bt);
    
    if(a==='' && b!=='') {
        return -1;
    }
    
    if(a!=='' && b==='') {
        return 1;
    }
    
    if(a == b) return 0;
    if(a > b) return 1;
    return -1;
}

function sort_array(a, b)
{
    res = cmp_values(a[0].toLowerCase(), b[0].toLowerCase(), a[1], b[1]);
    
    if(res==0)
    { // by first column of row
        r1 = a[2].getElementsByTagName('td').item(0).innerHTML.toLowerCase();
        r2 = b[2].getElementsByTagName('td').item(0).innerHTML.toLowerCase();
        return cmp_values(r1, r2);
    }
    
    return res;
}

function hide_empty_params(form, skip)
{
    hide_empty_params_tag(form, 'input', skip);
    hide_empty_params_tag(form, 'select', skip);
}

function hide_empty_params_tag(form, tag, skip)
{
    var inputs = form.getElementsByTagName(tag);
    var input, i;
    
    for(i = 0; input = inputs[i]; i++)
    {
        name = input.getAttribute('name');
        
        if(input.id && input.id.indexOf('priv_') !== -1) {
            input.value = rm_count(input.value);
        }
        
        value = input.value;
        if(name && (!value || value=='all' || value=='All') && (!skip || name!=skip)) {
            input.setAttribute('name', '');
        }
    }
}

function check_any_complete(form)
{
    var elements = form.elements;
    var complete = 0;
    for (var i = 0, element; element = elements[i++];)
    {
        if (element.type === "text" && element.value != "")
            return true;
        else if (element.type === "select-one" && element.value != "" && element.value.toLowerCase() != "all")
            return true;
    }
    
    return false;
}

function show_image(target)
{
    var img = document.getElementById('image-box');
    img.src = target.src.replace(/\/preview\//i, '/');
    img.style.display = 'block';
}

function hide_image(box)
{
    box.style.display = 'none';
}

function preview_image(input, view) {

    if (input.files && input.files[0])
    {
        var reader = new FileReader();

        reader.onload = function (e)
        {
            view = document.getElementById(view);
            view.src = e.target.result;
            view.style.display = 'block';
        }

        reader.readAsDataURL(input.files[0]);
    }
}

function show_email(id, name, domain, ext, subject)
{
    elem = document.getElementById(id);
    
    ref = "mailto:" + name + "@" + domain + "." + ext;
    if(subject) {
        ref += "?subject=" + subject;
    }
    elem.href = ref;
    elem.innerHTML = "E-mail";
}

function hide_item(id) {
    document.getElementById(id).style.display = 'none';
}

function show_item(id) {
    document.getElementById(id).style.display = 'block';
}

function switch_item(id, val)
{
    if(val) {
        show_item(id);
    }
    else {
        hide_item(id)
    }
}

function maintain_form(name, field)
{
    var form = document.forms[name];
    if(form != null)
    {
        form[field].setAttribute("type", "hidden");
    }
}

function validate_order()
{
    var form = document.forms["order"];
    var err = document.getElementById("err");
    var company = document.getElementById("company_radio").checked;
    
    var fields = ['company', 'website', 'name', 'surname', 'email', 'country', 'inventory', 'quantity'];
    
    for (var i = 0; i < fields.length; i++)
    {
        var element = fields[i];
        if(!company && (element=='company' || element=='website')) {
            continue;
        }
        if(form[element].value == null || form[element].value == "")
        {
            err.innerHTML = "All fields are required ("+form[element].placeholder+" is missed) <p></p>";
            return false;
        }
    };
    
    return true;
}

function set_order_price(obj, id, product)
{
    var price = document.getElementById(id);
    
    if(product=='LHWM')
    {
        total = obj.value*99*10/100; // 9.90 EUR
        total = total.toPrecision(total.toString().length);
        probes = obj.value*30;
        price.placeholder = "Price: " + total + " EUR (Hardware Monitoring — " + probes + " probes)";
    }
    else if(product=='AD')
    {
        total = obj.value*4999*10/100; // 499.90 EUR
        total = total.toPrecision(total.toString().length);
        months = obj.value + ' month'
        if(obj.value>1) {
            months += 's'
        }
        price.placeholder = "Price: " + total + " EUR (Advertisement on the site — " + months + ")";
    }
}

function set_order_kind(obj)
{
    if(obj.checked)
    {
        var company = obj.value=='company';
        switch_item('company_input', company);
        switch_item('website_input', company);
        if(company)
        {
            document.getElementById('name_input').placeholder = 'Contact first name*';
            document.getElementById('surname_input').placeholder = 'Contact last name*';
        }
        else
        {
            document.getElementById('name_input').placeholder = 'First Name*';
            document.getElementById('surname_input').placeholder = 'Last Name*';
        }
    }
}

function rm_count(str) {
    return str.replace(/ \(\d+\)$/, '');
}

function rm_nx(str) {
    return str.replace(/^\d+x\s+/, '');
}

function load_datalist()
{
    Awesomplete.$$('input.dropdown-input').forEach(function (input)
    {
        var comboplete = new Awesomplete(input, { minChars: 0 });
        
        document.getElementById('button_' + input.id).addEventListener('click', function()
        {
            if(comboplete.input.value) {
                document.getElementById('priv_' + input.id).value = comboplete.input.value;
            }
            
            comboplete.input.value = '';
            
            if (comboplete.ul.childNodes.length === 0 || (comboplete.input.value == '' && comboplete.ul.hasAttribute('hidden')))
            {
                comboplete.minChars = 0;
                comboplete.evaluate();
            }
            else if (comboplete.ul.hasAttribute('hidden')) {
                comboplete.open();
            }
            else
            {
                comboplete.close();
                comboplete.input.value = document.getElementById('priv_' + input.id).value;
            }
        });
    });
}

function setup_events()
{
    var select_year = document.getElementById('select_year');
    var select_type = document.getElementById('select_type');
    var select_vendor = document.getElementById('select_vendor');
    var select_model = document.getElementById('select_model');
    
    select_year.addEventListener('awesomplete-selectcomplete', function()
    {
        if(select_model)
        {
            select_model.value = 'All';
            set_priv_select('select_model', select_model);
        }
        select_type.value = 'All';
        select_vendor.value = 'All';
        
        set_priv_select('select_year', select_year);
        set_priv_select('select_type', select_type);
        set_priv_select('select_vendor', select_vendor);
        
        hide_empty_params(this.form);
        
        this.form.submit();
    });
    
    select_type.addEventListener('awesomplete-selectcomplete', function()
    {
        if(select_model)
        {
            select_model.value = 'All';
            set_priv_select('select_model', select_model);
        }
        select_vendor.value = 'All';
        
        set_priv_select('select_type', select_type);
        set_priv_select('select_vendor', select_vendor);
        
        hide_empty_params(this.form);
        
        this.form.submit();
    });
    
    select_vendor.addEventListener('awesomplete-selectcomplete', function()
    {
        if(select_model)
        {
            select_model.value = 'All';
            set_priv_select('select_model', select_model);
        }
        
        set_priv_select('select_vendor', select_vendor);
        
        hide_empty_params(this.form);
        
        this.form.submit();
    });
    
    if(select_model)
    {
        select_model.addEventListener('awesomplete-selectcomplete', function()
        {
            set_priv_select('select_model', select_model);
            
            hide_empty_params(this.form);
            
            this.form.submit();
        });
    }
}

function set_priv_select(id, sel)
{
    document.getElementById('priv_' + id).value = sel.value; // rm_count(sel.value);
}
