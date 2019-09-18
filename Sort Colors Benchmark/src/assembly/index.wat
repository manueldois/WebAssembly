(module
 (type $FUNCSIG$iii (func (param i32 i32) (result i32)))
 (type $FUNCSIG$vi (func (param i32)))
 (type $FUNCSIG$ii (func (param i32) (result i32)))
 (type $FUNCSIG$v (func))
 (type $FUNCSIG$iiiii (func (param i32 i32 i32 i32) (result i32)))
 (type $FUNCSIG$viiiii (func (param i32 i32 i32 i32 i32)))
 (type $FUNCSIG$vii (func (param i32 i32)))
 (memory $0 1)
 (data (i32.const 8) "\03\00\00\00\10\00\00\00\00\00\00\00\10\00\00\00\00\00\00\00\10")
 (global $~lib/rt/stub/startOffset (mut i32) (i32.const 0))
 (global $~lib/rt/stub/offset (mut i32) (i32.const 0))
 (global $~lib/rt/__rtti_base i32 (i32.const 8))
 (export "memory" (memory $0))
 (export "__alloc" (func $~lib/rt/stub/__alloc))
 (export "__retain" (func $~lib/rt/stub/__retain))
 (export "__release" (func $~lib/rt/stub/__release))
 (export "__collect" (func $~lib/rt/stub/__collect))
 (export "__rtti_base" (global $~lib/rt/__rtti_base))
 (export "getPixelRGB" (func $Sort Colors Benchmark/src/assembly/index/getPixelRGB))
 (export "setPixelRGB" (func $Sort Colors Benchmark/src/assembly/index/setPixelRGB))
 (export "rgbToHsl" (func $Sort Colors Benchmark/src/assembly/index/rgbToHsl))
 (export "sortImgData" (func $Sort Colors Benchmark/src/assembly/index/sortImgData))
 (start $start)
 (func $~lib/rt/stub/maybeGrowMemory (; 0 ;) (type $FUNCSIG$vi) (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  local.get $0
  memory.size
  local.tee $2
  i32.const 16
  i32.shl
  local.tee $1
  i32.gt_u
  if
   local.get $2
   local.get $0
   local.get $1
   i32.sub
   i32.const 65535
   i32.add
   i32.const -65536
   i32.and
   i32.const 16
   i32.shr_u
   local.tee $1
   local.get $2
   local.get $1
   i32.gt_s
   select
   memory.grow
   i32.const 0
   i32.lt_s
   if
    local.get $1
    memory.grow
    i32.const 0
    i32.lt_s
    if
     unreachable
    end
   end
  end
  local.get $0
  global.set $~lib/rt/stub/offset
 )
 (func $~lib/rt/stub/__alloc (; 1 ;) (type $FUNCSIG$iii) (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  local.get $0
  i32.const 1073741808
  i32.gt_u
  if
   unreachable
  end
  global.get $~lib/rt/stub/offset
  i32.const 16
  i32.add
  local.tee $3
  local.get $0
  i32.const 15
  i32.add
  i32.const -16
  i32.and
  local.tee $2
  i32.const 16
  local.get $2
  i32.const 16
  i32.gt_u
  select
  local.tee $4
  i32.add
  call $~lib/rt/stub/maybeGrowMemory
  local.get $3
  i32.const 16
  i32.sub
  local.tee $2
  local.get $4
  i32.store
  local.get $2
  i32.const -1
  i32.store offset=4
  local.get $2
  local.get $1
  i32.store offset=8
  local.get $2
  local.get $0
  i32.store offset=12
  local.get $3
 )
 (func $~lib/rt/stub/__retain (; 2 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  local.get $0
 )
 (func $~lib/rt/stub/__release (; 3 ;) (type $FUNCSIG$vi) (param $0 i32)
  nop
 )
 (func $~lib/rt/stub/__collect (; 4 ;) (type $FUNCSIG$v)
  nop
 )
 (func $Sort Colors Benchmark/src/assembly/index/getPixelRGB (; 5 ;) (type $FUNCSIG$iiiii) (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (result i32)
  local.get $1
  local.get $2
  i32.mul
  local.get $0
  i32.add
  i32.const 2
  i32.shl
  local.get $3
  i32.add
  i32.load
 )
 (func $Sort Colors Benchmark/src/assembly/index/setPixelRGB (; 6 ;) (type $FUNCSIG$viiiii) (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32)
  local.get $1
  local.get $2
  i32.mul
  local.get $0
  i32.add
  i32.const 2
  i32.shl
  local.get $3
  i32.add
  local.get $4
  i32.store
 )
 (func $Sort Colors Benchmark/src/assembly/index/rgbToHsl (; 7 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  (local $1 f32)
  (local $2 f32)
  (local $3 f32)
  (local $4 f32)
  (local $5 f32)
  (local $6 f32)
  (local $7 f32)
  local.get $0
  i32.const 8
  i32.shr_u
  i32.const 255
  i32.and
  f32.convert_i32_u
  f32.const 0.003921568859368563
  f32.mul
  local.tee $4
  local.get $0
  i32.const 16
  i32.shr_u
  i32.const 255
  i32.and
  f32.convert_i32_u
  f32.const 0.003921568859368563
  f32.mul
  local.tee $5
  f32.max
  local.get $4
  local.get $5
  f32.min
  local.get $0
  i32.const 255
  i32.and
  f32.convert_i32_u
  f32.const 0.003921568859368563
  f32.mul
  local.tee $6
  f32.min
  local.set $2
  local.get $6
  f32.max
  local.tee $1
  local.get $2
  f32.add
  f32.const 0.5
  f32.mul
  local.tee $7
  f32.const 255
  f32.mul
  i32.trunc_f32_u
  local.get $1
  local.get $2
  f32.eq
  if (result f32)
   f32.const 0
   local.set $2
   f32.const 0
  else
   local.get $1
   local.get $2
   f32.sub
   local.set $3
   local.get $7
   f32.const 0.5
   f32.gt
   if (result f32)
    local.get $3
    f32.const 2
    local.get $1
    f32.sub
    local.get $2
    f32.sub
    f32.div
   else
    local.get $3
    local.get $1
    local.get $2
    f32.add
    f32.div
   end
   local.set $2
   f32.const 1
   local.get $3
   f32.div
   local.set $3
   local.get $1
   local.get $6
   f32.eq
   if (result f32)
    local.get $4
    local.get $5
    f32.sub
    local.get $3
    f32.mul
    f32.const 6
    f32.const 0
    local.get $4
    local.get $5
    f32.lt
    select
    f32.add
   else
    local.get $1
    local.get $4
    f32.eq
    if (result f32)
     local.get $5
     local.get $6
     f32.sub
     local.get $3
     f32.mul
     f32.const 2
     f32.add
    else
     local.get $6
     local.get $4
     f32.sub
     local.get $3
     f32.mul
     f32.const 4
     f32.add
     f32.const 0
     local.get $1
     local.get $5
     f32.eq
     select
    end
   end
   f32.const 0.1666666716337204
   f32.mul
  end
  f32.const 255
  f32.mul
  i32.trunc_f32_u
  i32.const 16
  i32.shl
  local.get $2
  f32.const 255
  f32.mul
  i32.trunc_f32_u
  i32.const 8
  i32.shl
  i32.or
  i32.or
 )
 (func $Sort Colors Benchmark/src/assembly/index/sortImgData (; 8 ;) (type $FUNCSIG$vii) (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  local.get $1
  local.set $6
  loop $continue|0
   i32.const 0
   local.set $4
   i32.const 0
   local.set $2
   loop $loop|1
    block $break|1
     local.get $2
     local.get $6
     i32.ge_s
     br_if $break|1
     i32.const 0
     local.set $3
     loop $loop|2
      block $break|2
       local.get $3
       local.get $1
       i32.ge_s
       br_if $break|2
       local.get $1
       local.get $2
       i32.mul
       local.get $3
       i32.add
       i32.const 2
       i32.shl
       local.get $0
       i32.add
       i32.load
       local.set $5
       local.get $3
       i32.const 1
       i32.add
       local.get $1
       local.get $2
       i32.mul
       i32.add
       i32.const 2
       i32.shl
       local.get $0
       i32.add
       i32.load
       local.tee $7
       call $Sort Colors Benchmark/src/assembly/index/rgbToHsl
       i32.const 16
       i32.shr_u
       local.get $5
       call $Sort Colors Benchmark/src/assembly/index/rgbToHsl
       i32.const 16
       i32.shr_u
       i32.gt_u
       if
        local.get $1
        local.get $2
        i32.mul
        local.get $3
        i32.add
        i32.const 2
        i32.shl
        local.get $0
        i32.add
        local.get $7
        i32.store
        local.get $3
        i32.const 1
        i32.add
        local.get $1
        local.get $2
        i32.mul
        i32.add
        i32.const 2
        i32.shl
        local.get $0
        i32.add
        local.get $5
        i32.store
        i32.const 1
        local.set $4
       end
       local.get $3
       i32.const 1
       i32.add
       local.set $3
       br $loop|2
      end
     end
     local.get $2
     i32.const 1
     i32.add
     local.set $2
     br $loop|1
    end
   end
   local.get $4
   br_if $continue|0
  end
 )
 (func $start (; 9 ;) (type $FUNCSIG$v)
  i32.const 48
  global.set $~lib/rt/stub/startOffset
  i32.const 48
  global.set $~lib/rt/stub/offset
  i32.const 1
  memory.grow
  drop
 )
)
