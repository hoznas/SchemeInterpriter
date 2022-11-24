import {Obj,Num,Str,Sym,Cons,List,PairCell,ListCell,Nil,implementsList}  from './basic-types'
const nil = Nil.getInstance()

export abstract class TokenizerAndParser{
    static tokenize(code: string): Obj[]{
        const re_int = '[0-9]+'
        const re_str = '".*?"'
        const re_sym = '[a-zA-Z_]+'
        const re_op2 = '<=>|>=|<=|!=|==|[|][|]'
        const re_op1 = '-|[+*%<>/()]'
        const re = new RegExp(`(${re_int})|(${re_str})|(${re_sym}|${re_op2}|${re_op1})` ,"g")
        const result: Obj[] = [] 
        const replacer = function (_match:string, p_int:string, p_str:string, p_sym:string):string{
            if(p_int){
                result.push(new Num(parseInt(p_int)))
            }else if(p_str){
                // delete '"'
                result.push(new Str(p_str.substring(1,p_str.length-1)))
            }else if(p_sym) {
                result.push(new Sym(p_sym))
            }else{
                throw "ERROR at tokenize()"
                //console.log(match, p_int, p_str, p_sym)
            }
            return ""
        }
        code.replace(re, replacer)
        return result
    }
    static parse(tokens: Obj[]): List{
        const result: Obj[]=[]
        while(tokens.length != 0){
            const t = tokens.shift()!
            if(t instanceof Sym && t.value == "("){
                result.push(this.parse(tokens))
            }else if(t instanceof Sym && t.value == ")"){
                return this.ary2list(result)
            }else{
                result.push(t)
            }
        }
        return this.ary2list(result)
    }
    static ary2list(ary: Obj[]): List{
        if(ary.length != 0){
            const x = ary.shift()!
            return new ListCell(x,this.ary2list(ary))
        }
        return nil
    }
}