"use client"
import { useState } from 'react'
import { ArrowLeft, Users, ArrowRightLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"



export default function TableSwitchScreen() {
  const [tables, setTables] = useState([
    { id: 1, number: 'A1', capacity: 2, isOccupied: true },
    { id: 2, number: 'A2', capacity: 4, isOccupied: false },
    { id: 3, number: 'B1', capacity: 6, isOccupied: false },
    { id: 4, number: 'B2', capacity: 2, isOccupied: true },
    { id: 5, number: 'C1', capacity: 8, isOccupied: false },
    { id: 6, number: 'C2', capacity: 4, isOccupied: true },
    { id: 6, number: 'C2', capacity: 4, isOccupied: true },
    { id: 6, number: 'C2', capacity: 4, isOccupied: true },
    { id: 6, number: 'C2', capacity: 4, isOccupied: true },
    { id: 6, number: 'C2', capacity: 4, isOccupied: true },
  ])

  const [selectedTable, setSelectedTable] = useState(null)

  const handleTableSwitch = (newTable) => {
    if (selectedTable && !newTable.isOccupied) {
      setTables(tables.map(table => 
        table.id === selectedTable.id ? { ...table, isOccupied: false } :
        table.id === newTable.id ? { ...table, isOccupied: true } :
        table
      ))
      setSelectedTable(null)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <header className="bg-white p-4 flex items-center border-b fixed top-0 w-full z-10">
        <h1 className="text-xl font-semibold">Switch Table</h1>
      </header>

      <main className="flex-grow ">
        <ScrollArea className="h-[80vh] py-14 ">
          <div className="p-4 grid grid-cols-2 gap-4">
            {tables.map((table) => (
              <TableCard
                key={table.id}
                table={table}
                isSelected={selectedTable?.id === table.id}
                onSelect={() => setSelectedTable(table)}
                onSwitch={handleTableSwitch}
              />
            ))}
          </div>
        </ScrollArea>
      </main>

      <footer className="bg-gray-100 p-4  fixed bottom-16 w-full">
        <Button 
          className="w-full bg-[#F04F5F]" 
          disabled={!selectedTable}
          onClick={() => setSelectedTable(null)}
        >
          {selectedTable ? `Switch to Table ${selectedTable.number}` : 'Select a Table'}
        </Button>
      </footer>
    </div>
  )
}



function TableCard({ table, isSelected, onSelect, onSwitch }) {
  return (
    <div 
      className={`bg-white rounded-lg shadow p-4 ${
        isSelected ? 'ring-2 ring-[#F04F5F]' : ''
      } ${table.isOccupied ? 'opacity-50' : ''}`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-lg font-semibold">Table {table.number}</span>
        <Users className="h-5 w-5 text-gray-500" />
      </div>
      <div className="text-sm text-gray-600 mb-4">Capacity: {table.capacity}</div>
      {table.isOccupied ? (
        <span className="text-sm text-red-500">Occupied</span>
      ) : isSelected ? (
        <Button 
          variant="outline" 
          className="w-full text-xs" 
          onClick={() => onSwitch(table)}
        >
          Switch to this table
        </Button>
      ) : (
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={onSelect}
        >
          Select
        </Button>
      )}
    </div>
  )
}