import scala.util.matching.Regex


abstract class ScmObj
class ScmInt(v:Int) extends ScmObj{
  override def toString():String = v.toString()
}
class ScmSym(v:String) extends ScmObj{
  override def toString():String = v.toString()
}
class ScmStr(v:String) extends ScmObj{
  override def toString():String = "\"" + v.toString() + "\""
}
class ScmCons(car:ScmObj,cdr:ScmObj) extends ScmObj{
  override def toString():String = "(%s . %s)".format(car,cdr)
}
class ScmNil extends ScmObj{
  override def toString():String = "nil"
}


object SchemeInterpriter{
  def drop_ws(src: String): String ={
    val re_ws:Regex = """^(\s+)(.*)""".r
    src match {
      case re_ws(_,x) => x
      case _        => src
    }
  }

  def tokenize(src: String): List[String] ={
    val src2 = drop_ws(src)
    if(src2 == "") return Nil
    val re_lpar:Regex = """^(\()(.*)""".r
    val re_rpar:Regex = """^(\))(.*)""".r
    val re_op:Regex = """^(\+|\-|<=|>=|!=|<|>)(.*)""".r
    val re_num:Regex = """^(\d+)(.*)""".r
    val re_sym:Regex = """^([a-zA-Z_][a-zA-Z0-9_]*)(.*)""".r
    val re_str:Regex = """^"(.*?)"(.*)""".r

    val (token,rest) = src2 match {
      case re_lpar(x,y)  => (x,y)
      case re_rpar(x,y)  => (x,y)
      case re_op(x,y) => (x,y)
      case re_num(x,y) => (x,y)
      case re_str(x,y) => (x,y)
      case re_sym(x,y) => (x,y)
      case _         => throw new Exception("tokenize() ERROR at ["+src2+"]")
    }
    return token :: tokenize(rest)
  }

  //def parse(tokens:List[String]):ScmObj = {

  //}

  def main(args: Array[String]) :Unit = {
    val src = "(+ abc (def a 12) 9)(func1 _asd)"
    println(drop_ws(" \t\r\nhello"))
    println(tokenize(src).mkString("","|",""))
  }
}