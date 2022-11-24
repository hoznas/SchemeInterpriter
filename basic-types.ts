export type Obj = Num | Str | Sym | Cons | Nil | List

export class Num{
    constructor(public value:number){}
    toString(){return String(this.value)}
    eq(other:Obj):Obj{
        if(other instanceof Num && other.value === this.value) return new Str("TRUE")
        else return nil 
    }
}

export class Str{
    constructor(public value:string){}
    toString(){return `"${this.value}"`}
    eq(other:Obj):Obj{
        if(other instanceof Str && other.value === this.value) return new Str("TRUE")
        else return nil 
    }
}

export class Sym{
    constructor(public value:string){}
    toString(){return this.value}
    eq(other:Obj):Obj{
        throw "ERROR Sym#eq() called"
    }
}

export class Nil implements List{
    private static instance = new Nil
    static getInstance(){return this.instance}
    private constructor(){} 
    head():Obj{ return this} 
    tail():List{ return this} 
    toString(){return "Nil"}
    eq(other:Obj):Obj{
        if(other instanceof Nil && other === nil) return new Str("TRUE")
        else return nil 
    }
}
export const nil = Nil.getInstance()

export function implementsList(arg:any): arg is List{
    return arg != null && typeof arg === "object" && arg.head === "object" && arg.tail === "object"
}
export interface List{
    head(): Obj
    tail(): List
    toString():string
    eq(other:Obj):Obj
}

export abstract class Cons{
    static new(car:Obj,cdr:Obj):Cons{
        if(implementsList(cdr)){
            return new ListCell(car, cdr)
        }else{
            return new PairCell(car,cdr)
        }
    }
    abstract car():Obj
    abstract cdr():Obj
    eq(other:Obj):Obj{
        if(other instanceof Cons){
            if(this.car().eq(other.car()) && this.car().eq(other.car()))
                return new Str("TRUE")
        }
        return nil 
    }
}

export class PairCell extends Cons{
    constructor(private car_: Obj, private cdr_: Obj){super()}
    car():Obj{ return this.car_} 
    cdr():Obj{ return this.cdr_} 
    toString():string{
        return `(${this.car_.toString()}.${this.cdr_.toString()})`
    }
}

export class ListCell extends Cons implements  List{
    constructor(private head_: Obj, private tail_: List){super()}
    car():Obj{ return this.head_} 
    cdr():Obj{ return this.tail_}
    head():Obj{ return this.head_} 
    tail():List{ return this.tail_} 
    toString():string{
        let result: string = "("
        for(let ptr:List=this; ptr!=nil; ptr=ptr.tail()){
            result += ` ${ptr.head().toString()}`
        }
        return result + ")"
    }
}